const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 命令执行器
const run = (command) => {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`执行命令失败: ${command}`);
    process.exit(1);
  }
};

// 读取package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);
const currentVersion = packageJson.version;

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`当前版本: ${currentVersion}`);
console.log('请选择要发布的版本类型:');
console.log('1) 补丁版本 (patch) - 修复错误的小版本');
console.log('2) 次要版本 (minor) - 添加功能的版本');
console.log('3) 主要版本 (major) - 不向下兼容的大版本');
console.log('4) 自定义版本号');

rl.question('请选择 [1-4]: ', (answer) => {
  let newVersion;
  
  if (answer === '1' || answer === '2' || answer === '3') {
    const versionType = ['patch', 'minor', 'major'][parseInt(answer) - 1];
    // 使用npm version命令自动计算新版本号
    newVersion = execSync(`npm --no-git-tag-version version ${versionType}`).toString().trim().slice(1);
  } else if (answer === '4') {
    rl.question('请输入自定义版本号: ', (customVersion) => {
      newVersion = customVersion;
      updateVersionAndRelease(newVersion);
      rl.close();
    });
    return;
  } else {
    console.log('无效选择，退出');
    rl.close();
    process.exit(1);
  }

  updateVersionAndRelease(newVersion);
  rl.close();
});

function updateVersionAndRelease(newVersion) {
  console.log(`准备发布版本: ${newVersion}`);
  
  // 更新package.json中的版本号
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ 已更新package.json版本号');
  
  // 生成CHANGELOG
  run('npm run changelog');
  console.log('✅ 已生成CHANGELOG');
  
  // 提交更改
  run('git add .');
  run(`git commit -m "🔖 chore(release): v${newVersion}"`);
  console.log('✅ 已提交版本更新');

  // 创建标签
  run(`git tag v${newVersion}`);
  console.log('✅ 已创建版本标签');
  
  console.log(`\n发布版本 v${newVersion} 完成!`);
  console.log('\n要推送到远程仓库，请执行:');
  console.log('git push && git push --tags');
} 