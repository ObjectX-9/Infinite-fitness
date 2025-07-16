module.exports = {
  // 可选类型
  types: [
    { value: '✨ feat', name: '✨ feat:     新功能' },
    { value: '🐛 fix', name: '🐛 fix:      修复bug' },
    { value: '📝 docs', name: '📝 docs:     文档变更' },
    { value: '💄 style', name: '💄 style:    代码格式（不影响功能）' },
    { value: '♻️ refactor', name: '♻️ refactor: 代码重构' },
    { value: '⚡️ perf', name: '⚡️ perf:     性能优化' },
    { value: '✅ test', name: '✅ test:     添加或修改测试' },
    { value: '🔧 chore', name: '🔧 chore:    构建过程或辅助工具变动' },
    { value: '⏪ revert', name: '⏪ revert:   回退代码' },
    { value: '🚀 deploy', name: '🚀 deploy:   部署' },
    { value: '🎉 init', name: '🎉 init:     初始化' },
  ],

  // 可选范围
  scopes: [
    { name: 'components' },
    { name: 'utils' },
    { name: 'styles' },
    { name: 'ui' },
    { name: 'deps' },
    { name: 'auth' },
    { name: 'config' },
    { name: 'api' },
    { name: 'hooks' },
    { name: 'other' },
  ],

  // 自定义提交消息规则
  messages: {
    type: '请选择提交类型:',
    scope: '本次提交的影响范围 (可选):',
    customScope: '请输入自定义的影响范围:',
    subject: '请简要描述提交 (必填):',
    body: '请输入详细描述 (可选，按回车跳过):',
    breaking: '列出任何破坏性变更 (可选，按回车跳过):',
    footer: '列出相关 ISSUE (可选，按回车跳过):',
    confirmCommit: '确认提交以上信息?',
  },

  // 是否允许自定义范围
  allowCustomScopes: true,

  // 跳过问题
  skipQuestions: ['breaking', 'footer'],
  
  // subject 验证规则
  subjectLimit: 100,
  
  // 默认影响范围为空
  allowBreakingChanges: ['feat', 'fix'],

  // 格式化提交信息
  formatCommitMessage: ({ type, scope, subject }) => {
    return scope ? `${type}(${scope}): ${subject}` : `${type}: ${subject}`;
  },
}; 