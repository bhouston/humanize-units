export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/bhouston/humanize-units.git',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    '@anolilab/semantic-release-pnpm',
    './scripts/pack-release.mjs',
    [
      '@semantic-release/github',
      {
        assets: ['release/*.tgz'],
        successComment: false,
        failComment: false,
        failTitle: false,
        releasedLabels: false,
      },
    ],
  ],
};
