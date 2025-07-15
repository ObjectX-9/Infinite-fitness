import { BaseExerciseItem, DifficultyLevel } from './type';

// 训练项目假数据
export const exerciseItems: BaseExerciseItem[] = [
  // 胸部训练
  {
    id: 'ex001',
    name: '卧推',
    description: '平躺在卧推凳上，使用杠铃或哑铃向上推举，训练胸部肌肉',
    videoUrl: '/videos/exercises/bench-press.mp4',
    imageUrls: ['/images/exercises/bench-press.jpg'],
    muscleTypeIds: ['mu001', 'mu002', 'mu005', 'mu006'],
    equipmentTypeId: 'eq002', // 杠铃
    difficulty: DifficultyLevel.MEDIUM,
    fitnessGoalsIds: ['fg001', 'fg003'],
    usageScenariosIds: ['us001'],
    recommendedSets: 4,
    recommendedReps: '8-12',
    recommendedWeight: '根据个人能力，保证最后一组最后几次感到困难',
    recommendedRestTime: '1-2分钟',
    tips: [
      '保持肩胛骨收紧',
      '下放杠铃至胸部中下位置',
      '手肘不要过度外展'
    ],
    commonMistakes: [
      '弓起背部',
      '手肘角度过大',
      '反弹杠铃'
    ],
    alternatives: ['哑铃卧推', '俯卧撑', '器械卧推'],
    caloriesBurned: 120,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 背部训练
  {
    id: 'ex002',
    name: '引体向上',
    description: '抓住横杠，将身体向上拉，直到下巴超过杠，训练背部和手臂',
    videoUrl: '/videos/exercises/pull-up.mp4',
    imageUrls: ['/images/exercises/pull-up.jpg'],
    muscleTypeIds: ['mu003', 'mu004', 'mu005'],
    equipmentTypeId: 'eq002', // 杠铃架/单杠
    difficulty: DifficultyLevel.HARD,
    fitnessGoalsIds: ['fg001', 'fg003'],
    usageScenariosIds: ['us001', 'us003'],
    recommendedSets: 3,
    recommendedReps: '6-10',
    recommendedRestTime: '2分钟',
    tips: [
      '控制下放速度',
      '肩膀下沉，保持胸部挺起',
      '变化握距可以刺激不同肌肉部位'
    ],
    commonMistakes: [
      '过度使用惯性',
      '没有完全伸展',
      '握距不当'
    ],
    alternatives: ['辅助引体向上', '高位下拉', '反向划船'],
    caloriesBurned: 150,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 腿部训练
  {
    id: 'ex003',
    name: '深蹲',
    description: '站立，双脚与肩同宽，弯曲膝盖和臀部下蹲，然后站起',
    videoUrl: '/videos/exercises/squat.mp4',
    imageUrls: ['/images/exercises/squat.jpg'],
    muscleTypeIds: ['mu007', 'mu008', 'mu011', 'mu012'],
    equipmentTypeId: 'eq002', // 杠铃
    difficulty: DifficultyLevel.MEDIUM,
    fitnessGoalsIds: ['fg001', 'fg003', 'fg005'],
    usageScenariosIds: ['us001', 'us002', 'us003'],
    recommendedSets: 4,
    recommendedReps: '6-12',
    recommendedWeight: '根据个人能力，保证最后一组最后几次感到困难',
    recommendedRestTime: '2-3分钟',
    tips: [
      '保持脊柱中立',
      '膝盖与脚尖方向一致',
      '下蹲至少达到大腿与地面平行'
    ],
    commonMistakes: [
      '膝盖内扣',
      '背部弯曲',
      '脚跟抬起'
    ],
    alternatives: ['哑铃深蹲', '箱式深蹲', '保加利亚分腿蹲'],
    caloriesBurned: 180,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 肩部训练
  {
    id: 'ex004',
    name: '肩部推举',
    description: '坐姿或站姿，将杠铃或哑铃从肩部位置推至头顶上方',
    videoUrl: '/videos/exercises/shoulder-press.mp4',
    imageUrls: ['/images/exercises/shoulder-press.jpg'],
    muscleTypeIds: ['mu004', 'mu006'],
    equipmentTypeId: 'eq001', // 哑铃
    difficulty: DifficultyLevel.MEDIUM,
    fitnessGoalsIds: ['fg001', 'fg003'],
    usageScenariosIds: ['us001', 'us002'],
    recommendedSets: 3,
    recommendedReps: '8-12',
    recommendedWeight: '中等重量，保持良好姿势',
    recommendedRestTime: '1-2分钟',
    tips: [
      '避免过度弓背',
      '不要锁定肘部',
      '核心收紧保持稳定'
    ],
    commonMistakes: [
      '过度后仰',
      '使用太大重量导致姿势不正确',
      '不完成全程动作'
    ],
    alternatives: ['站姿推举', '器械推举', '阿诺德推举'],
    caloriesBurned: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 手臂训练
  {
    id: 'ex005',
    name: '二头弯举',
    description: '站姿或坐姿，弯曲肘部将哑铃或杠铃向肩部方向卷起',
    videoUrl: '/videos/exercises/bicep-curl.mp4',
    imageUrls: ['/images/exercises/bicep-curl.jpg'],
    muscleTypeIds: ['mu005'],
    equipmentTypeId: 'eq001', // 哑铃
    difficulty: DifficultyLevel.EASY,
    fitnessGoalsIds: ['fg001'],
    usageScenariosIds: ['us001', 'us002'],
    recommendedSets: 3,
    recommendedReps: '10-15',
    recommendedWeight: '中等重量，能够完成目标次数',
    recommendedRestTime: '45-60秒',
    tips: [
      '保持上臂固定',
      '完全伸展和收缩肌肉',
      '控制动作，避免摆动'
    ],
    commonMistakes: [
      '使用身体摆动来增加动量',
      '手腕位置不当',
      '上臂不固定'
    ],
    alternatives: ['锤式弯举', '反向弯举', '器械弯举'],
    caloriesBurned: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 腹部训练
  {
    id: 'ex006',
    name: '仰卧起坐',
    description: '仰卧，膝盖弯曲，双手交叉放在胸前，抬起上身然后回到起始位置',
    videoUrl: '/videos/exercises/sit-up.mp4',
    imageUrls: ['/images/exercises/sit-up.jpg'],
    muscleTypeIds: ['mu009', 'mu010'],
    equipmentTypeId: 'eq006', // 瑜伽垫
    difficulty: DifficultyLevel.EASY,
    fitnessGoalsIds: ['fg002', 'fg005'],
    usageScenariosIds: ['us001', 'us002', 'us003', 'us004'],
    recommendedSets: 3,
    recommendedReps: '15-20',
    recommendedRestTime: '30-60秒',
    tips: [
      '避免颈部用力',
      '控制动作速度',
      '呼气时抬起，吸气时下降'
    ],
    commonMistakes: [
      '过度使用髋屈肌',
      '拉扯颈部',
      '速度过快'
    ],
    alternatives: ['卷腹', '悬垂举腿', '平板支撑'],
    caloriesBurned: 70,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 有氧训练
  {
    id: 'ex007',
    name: '跑步',
    description: '在跑步机上或户外进行中等强度到高强度的跑步',
    videoUrl: '/videos/exercises/running.mp4',
    imageUrls: ['/images/exercises/running.jpg'],
    muscleTypeIds: ['mu007', 'mu008', 'mu011'],
    equipmentTypeId: 'eq003', // 跑步机
    difficulty: DifficultyLevel.MEDIUM,
    fitnessGoalsIds: ['fg002', 'fg004'],
    usageScenariosIds: ['us001', 'us003'],
    recommendedSets: 1,
    recommendedReps: '20-30分钟',
    recommendedRestTime: '视情况而定',
    duration: '20-30分钟',
    tips: [
      '保持正确姿势，头部挺直',
      '脚跟先着地，然后滚动到前脚掌',
      '根据体能水平调整强度'
    ],
    commonMistakes: [
      '步伐过大',
      '着地方式不当',
      '呼吸不规律'
    ],
    alternatives: ['快走', '椭圆机', '骑自行车'],
    caloriesBurned: 300,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 恢复训练
  {
    id: 'ex008',
    name: '泡沫轴放松',
    description: '使用泡沫轴对肌肉和肌筋膜进行自我按摩，帮助恢复和放松',
    videoUrl: '/videos/exercises/foam-rolling.mp4',
    imageUrls: ['/images/exercises/foam-rolling.jpg'],
    muscleTypeIds: ['mu003', 'mu007', 'mu008', 'mu011'],
    equipmentTypeId: 'eq005', // 泡沫轴
    difficulty: DifficultyLevel.EASY,
    fitnessGoalsIds: ['fg005', 'fg006'],
    usageScenariosIds: ['us001', 'us002', 'us004'],
    recommendedSets: 1,
    recommendedReps: '每个部位30-60秒',
    recommendedRestTime: '无需休息',
    duration: '10-15分钟',
    tips: [
      '在疼痛点停留并呼吸',
      '放松目标肌肉',
      '动作缓慢且有控制'
    ],
    commonMistakes: [
      '动作过快',
      '压力不足',
      '姿势不正确'
    ],
    alternatives: ['拉伸', '按摩球', '按摩枪'],
    caloriesBurned: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 按ID获取训练项目
export const getExerciseItemById = (id: string): BaseExerciseItem | undefined => {
  return exerciseItems.find(exercise => exercise.id === id);
};

// 按肌肉类型获取训练项目
export const getExerciseItemsByMuscleId = (muscleId: string): BaseExerciseItem[] => {
  return exerciseItems.filter(exercise => exercise.muscleTypeIds.includes(muscleId));
};

// 按器材类型获取训练项目
export const getExerciseItemsByEquipmentId = (equipmentId: string): BaseExerciseItem[] => {
  return exerciseItems.filter(exercise => exercise.equipmentTypeId === equipmentId);
};

// 按难度级别获取训练项目
export const getExerciseItemsByDifficulty = (difficulty: DifficultyLevel): BaseExerciseItem[] => {
  return exerciseItems.filter(exercise => exercise.difficulty === difficulty);
};
