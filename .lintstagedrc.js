module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    (files) => `tsc-files --noEmit ${files.join(' ')}`
  ],
  '*.{js,jsx}': [
    'eslint --fix'
  ]
}