const { Badge } = require('../models');

const defaultBadges = [
  {
    name: 'Premier Pas',
    description: 'Félicitations ! Vous avez terminé votre premier quiz.',
    icon: '🎯',
    condition: 'first_quiz',
    conditionValue: 1
  },
  {
    name: 'Perfectionniste',
    description: 'Score parfait ! Toutes les réponses étaient correctes.',
    icon: '💯',
    condition: 'perfect_score',
    conditionValue: 1
  },
  {
    name: 'Éclair',
    description: 'Vitesse impressionnante ! Moins de 10 secondes par question en moyenne.',
    icon: '⚡',
    condition: 'speed_demon',
    conditionValue: 10
  },
  {
    name: 'Maître des Quiz',
    description: 'Expert confirmé avec 10 quiz terminés.',
    icon: '🏆',
    condition: 'quiz_master',
    conditionValue: 10
  },
  {
    name: 'Expert Programmation',
    description: '5 quiz parfaits dans la catégorie Programmation.',
    icon: '💻',
    condition: 'category_expert',
    conditionValue: 5,
    conditionCategory: 'Programming'
  },
  {
    name: 'Série Parfaite',
    description: '5 quiz parfaits consécutifs, incroyable !',
    icon: '🔥',
    condition: 'streak_5',
    conditionValue: 5
  },
  {
    name: 'Collectionneur',
    description: '1000 points accumulés, vous êtes un vrai passionné !',
    icon: '💎',
    condition: 'point_collector',
    conditionValue: 1000
  }
];

const seedBadges = async () => {
  try {
    console.log('🎖️ Seeding badges...');

    for (const badgeData of defaultBadges) {
      const [badge, created] = await Badge.findOrCreate({
        where: { name: badgeData.name },
        defaults: badgeData
      });

      if (created) {
        console.log(`✅ Badge created: ${badge.name}`);
      } else {
        console.log(`ℹ️ Badge already exists: ${badge.name}`);
      }
    }

    console.log('🎖️ Badge seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    throw error;
  }
};

module.exports = seedBadges;

// Exécuter si appelé directement
if (require.main === module) {
  const { syncDatabase } = require('../models');

  (async () => {
    try {
      await syncDatabase();
      await seedBadges();
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  })();
}