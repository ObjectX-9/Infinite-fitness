module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(.*?)(?:\((.*)\))?:\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'deploy',
        'init',
        '✨ feat',
        '🐛 fix',
        '📝 docs',
        '💄 style',
        '♻️ refactor',
        '⚡️ perf',
        '✅ test',
        '🔧 chore',
        '⏪ revert',
        '🚀 deploy',
        '🎉 init',
      ],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
}; 