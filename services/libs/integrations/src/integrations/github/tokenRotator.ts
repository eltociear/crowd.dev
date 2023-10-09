import { ICache } from '@crowd/types'
import axios from 'axios'
import { RateLimitError } from '@crowd/types'

interface TokenInfo {
  token: string
  remaining: number
  reset: number
}

const highPrioiryIntegrations = [
  // tiptap
  'e9d270e3-9425-4d9c-9f01-f8edfa4c52d4',
  // plane
  'a3caf6bd-02bb-461e-b067-3f2331b591f0',
  // superset
  '638918cf-b112-4397-b8da-038de434b173',
  // qdrant
  '38e57e57-a3b0-4b22-a858-b01aca9fcfa7',
]

export class GithubTokenRotator {
  static CACHE_KEY = 'integration-cache:github-token-rotator:tokens'
  constructor(private cache: ICache, private tokens: string[]) {
    this.cache = cache
    this.tokens = [...new Set(tokens)]
    this.initializeTokens()
  }

  private async initializeTokens(): Promise<void> {
    for (const token of this.tokens) {
      const tokenInfo: TokenInfo = JSON.parse(
        await this.cache.hget(GithubTokenRotator.CACHE_KEY, token),
      )
      if (!tokenInfo) {
        const newTokenInfo: TokenInfo = {
          token,
          remaining: 0,
          reset: 0,
        }
        await this.cache.hset(GithubTokenRotator.CACHE_KEY, token, JSON.stringify(newTokenInfo))
      }
    }
  }

  public async getToken(integrationId: string, err?: any): Promise<string | null> {
    const tokens = await this.cache.hgetall(GithubTokenRotator.CACHE_KEY)
    let minResetTime = Infinity

    if (!highPrioiryIntegrations.includes(integrationId)) {
      if (err) {
        throw err
      } else {
        throw new Error('No available tokens for low priority integration')
      }
    }

    for (const token in tokens) {
      const tokenInfo: TokenInfo = JSON.parse(tokens[token])
      if (tokenInfo.remaining > 0 || tokenInfo.reset < Math.floor(Date.now() / 1000)) {
        await this.cache.hset(GithubTokenRotator.CACHE_KEY, token, JSON.stringify(tokenInfo))
        return token
      }
      minResetTime = Math.min(minResetTime, tokenInfo.reset)
    }

    const waitTime =
      minResetTime - Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 120) + 60

    // if we have to wait less than 60 seconds, let's wait and try again
    if (waitTime <= 60) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await this.getToken(integrationId))
        }, waitTime * 1000)
      })
    }

    throw new RateLimitError(
      waitTime + Math.floor(Math.random() * 120) + 60,
      'token-rotator',
      `No available tokens in GitHubTokenRotator. Please wait for ${waitTime} seconds`,
    )
  }

  public async returnToken(token: string): Promise<void> {
    const tokenInfo: TokenInfo = JSON.parse(
      (await this.cache.hget(GithubTokenRotator.CACHE_KEY, token)) || '',
    )
    if (tokenInfo) {
      await this.cache.hset(GithubTokenRotator.CACHE_KEY, token, JSON.stringify(tokenInfo))
    }
  }

  public async updateTokenInfo(token: string, remaining: number, reset: number): Promise<void> {
    const tokenInfo: TokenInfo = JSON.parse(
      (await this.cache.hget(GithubTokenRotator.CACHE_KEY, token)) || '',
    )
    if (tokenInfo) {
      tokenInfo.remaining = remaining
      tokenInfo.reset = reset
      await this.cache.hset(GithubTokenRotator.CACHE_KEY, token, JSON.stringify(tokenInfo))
    }
  }

  public async updateRateLimitInfoFromApi(token: string): Promise<void> {
    // let's make API call to get the latest rate limit info
    const tokenInfo: TokenInfo = JSON.parse(
      (await this.cache.hget(GithubTokenRotator.CACHE_KEY, token)) || '',
    )
    if (tokenInfo) {
      const response = await axios({
        url: 'https://api.github.com/rate_limit',
        method: 'get',
        headers: { Authorization: `token ${token}` },
      })

      const remaining = parseInt(response.data.resources.graphql.remaining)
      const reset = parseInt(response.data.resources.graphql.reset)
      await this.updateTokenInfo(token, remaining, reset)
    }
  }

  //   public async apiRequest(
  //     url: string,
  //     method: 'get' | 'post' | 'put' | 'delete',
  //     data?: any,
  //   ): Promise<any> {
  //     const token = await this.getToken()
  //     if (!token) {
  //       throw new Error('No available tokens')
  //     }

  //     try {
  //       const response = await axios({
  //         url,
  //         method,
  //         data,
  //         headers: { Authorization: `token ${token}` },
  //       })

  //       const remaining = parseInt(response.headers['x-ratelimit-remaining'])
  //       const reset = parseInt(response.headers['x-ratelimit-reset'])
  //       await this.updateTokenInfo(token, remaining, reset)

  //       return response.data
  //     } finally {
  //       await this.returnToken(token)
  //     }
  //   }
}
