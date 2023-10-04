import Plans from '@/security/plans';
import config from '@/config';

const crowdHostedPlans = Plans.values;
const communityPlans = Plans.communityValues;

export const plans = {
  crowdHosted: [
    {
      key: crowdHostedPlans.essential,
      title: 'Essential',
      description: 'Understand & manage your community',
      price: 'Free',
      features: [
        'Unlimited seats',
        'Unlimited contacts, organizations & activities',
        '1K monthly active contacts',
        'Get data from GitHub, Discord, Slack, Discourse, DEV, Reddit, Stack Overflow, Hacker News, Zapier, n8n & more',
        '2 active automations & CSV exports',
        'Sentiment analysis',
        'Full API access',
        'Community & in-app support',
      ],
      ctaLabel: {
        [Plans.values.eagleEye]: 'Downgrade to Essential',
        [Plans.values.growth]: 'Downgrade to Essential',
        [Plans.values.scale]: 'Downgrade to Essential',
        [Plans.values.enterprise]: 'Downgrade to Essential',
      },
      ctaAction: {
        [Plans.values.eagleEye]: () => {
          window.open(config.stripe.customerPortalLink, '_blank');
        },
        [Plans.values.growth]: () => {
          window.open(config.stripe.customerPortalLink, '_blank');
        },
        [Plans.values.scale]: () => {
          window.open(config.stripe.customerPortalLink, '_blank');
        },
        [Plans.values.enterprise]: () => {
          window.open(config.stripe.customerPortalLink, '_blank');
        },
      },
    },
    {
      key: crowdHostedPlans.scale,
      title: 'Scale',
      description:
        'Commercialize your open source product',
      price: '$950/year',
      priceInfo: 'annual payment',
      featuresNote: 'Everything in Essential, plus:',
      features: [
        '10k monthly active contacts',
        'LinkedIn & HubSpot',
        'Smart enrichment of all active contacts & organizations',
        '20 active automations & CSV exports',
        'Slack connect support',
      ],
      featuresSpecial: [
        '90$ for each additional 1K MAC',
      ],
      ctaLabel: {
        [Plans.values.eagleEye]: 'Start 30-days trial',
        [Plans.values.essential]: 'Start 30-days trial',
        [Plans.values.growth]: 'Start 30-days trial',
        [Plans.values.enterprise]: 'Downgrade to Scale',
      },
      ctaAction: {
        [Plans.values.eagleEye]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/intro-to-crowd-dev',
            '_blank',
          );
        },
        [Plans.values.essential]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/intro-to-crowd-dev',
            '_blank',
          );
        },
        [Plans.values.growth]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/intro-to-crowd-dev',
            '_blank',
          );
        },
        [Plans.values.enterprise]: () => {
          window.open(config.stripe.customerPortalLink, '_blank');
        },
      },
    },
    {
      key: crowdHostedPlans.enterprise,
      title: 'Enterprise',
      description:
        'Tailored to your needs',
      price: 'Custom price',
      featuresNote: 'Everything in Scale, plus:',
      features: [
        'Self hosting with enterprise support',
        'Custom integrations',
        'Activity categorization & topic analysis',
        'Unlimited active automations & CSV exports',
        'Custom RBAC & SAML-based SSO',
        'Dedicated community expert',
      ],
      ctaLabel: {
        [Plans.values.eagleEye]: 'Book a call',
        [Plans.values.essential]: 'Book a call',
        [Plans.values.growth]: 'Book a call',
        [Plans.values.scale]: 'Book a call',
      },
      ctaAction: {
        [Plans.values.eagleEye]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/custom-plan',
            '_blank',
          );
        },
        [Plans.values.essential]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/custom-plan',
            '_blank',
          );
        },
        [Plans.values.growth]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/custom-plan',
            '_blank',
          );
        },
        [Plans.values.scale]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/custom-plan',
            '_blank',
          );
        },
      },
    },
  ],
  community: [
    {
      key: communityPlans.community,
      title: 'Community',
      description:
        "Keep ownership of your data and host crowd.dev's community version for free on your own premises",
      price: 'Free',
      features: [
        'Unlimited seats',
        'Unlimited community contacts & activities',
        'Community management',
        'Community intelligence',
        'Integrations with GitHub, Discord, Slack, Twitter, DEV, Hacker News',
        'Community support',
      ],
      ctaLabel: {
        [Plans.communityValues.custom]: 'Downgrage to Community',
      },
      ctaAction: {
        [Plans.communityValues.custom]: () => {
          window.open(config.stripe.customerPortalLink, '_blank');
        },
      },
    },
    {
      key: communityPlans.custom,
      title: 'Custom',
      description:
        "Get access to crowd.dev's premium features and support, and host the platform on your own premises",
      price: 'On request',
      featuresNote: 'Everything in Community, plus:',
      features: [
        'Community growth',
        'Organization-level insights',
        'Custom integrations',
        'Enterprise-grade support',
        'LinkedIn integration',
        'Unlimited contact enrichments (automated)',
      ],
      ctaLabel: {
        [Plans.communityValues.community]: 'Book a call',
      },
      ctaAction: {
        [Plans.communityValues.community]: () => {
          window.open(
            'https://cal.com/team/CrowdDotDev/custom-plan',
            '_blank',
          );
        },
      },
    },
  ],
};
