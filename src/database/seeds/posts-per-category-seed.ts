import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Post, PostStatus } from '../../modules/posts/entities/post.entity';
import { dataSourceOptions } from '../../config/database.config';

const dataSource = new DataSource(dataSourceOptions);

// Sample post titles and content for variety
const postTitles = [
  'Getting Started with Modern Development',
  'Best Practices and Tips',
  'Advanced Techniques You Should Know',
  'Common Mistakes to Avoid',
  'The Future of Technology',
  'Essential Tools and Resources',
  'Step-by-Step Tutorial',
  'Performance Optimization Guide',
  'Security Considerations',
  'Latest Trends and Updates'
];

const postContents = [
  'This comprehensive guide covers everything you need to know to get started with modern development practices.',
  'Learn the best practices that will help you write cleaner, more maintainable code.',
  'Discover advanced techniques that will take your skills to the next level.',
  'Avoid these common pitfalls that many developers encounter in their journey.',
  'Explore what the future holds for technology and how to prepare for it.',
  'A curated list of essential tools and resources every developer should know about.',
  'Follow this detailed tutorial to master the fundamentals step by step.',
  'Learn how to optimize performance and create faster, more efficient applications.',
  'Understanding security is crucial - here are the key considerations you need to know.',
  'Stay up to date with the latest trends and updates in the industry.'
];

function getUnsplashImage(width: number = 800, height: number = 600): string {
  const randomSeed = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/${width}/${height}?random=${randomSeed}`;
}

function randomDate(): Date {
  const now = new Date();
  const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function createSlug(title: string, index: number): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + `-${index}`;
}

async function seedPostsPerCategory() {
  console.log('🌱 Starting posts per category seeding...\n');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    const userRepo = dataSource.getRepository(User);
    const categoryRepo = dataSource.getRepository(Category);
    const postRepo = dataSource.getRepository(Post);

    // Get all categories
    const categories = await categoryRepo.find();
    if (categories.length === 0) {
      console.log('❌ No categories found. Please run the comprehensive seed first.');
      return;
    }

    // Get all users (excluding admin)
    const users = await userRepo.find();
    const nonAdminUsers = users.filter(user => user.email !== 'admin@example.com');
    
    if (nonAdminUsers.length === 0) {
      console.log('❌ No users found. Please run the comprehensive seed first.');
      return;
    }

    console.log(`📦 Found ${categories.length} categories and ${nonAdminUsers.length} users`);
    console.log('🚀 Creating 10 posts per category...\n');

    let totalPostsCreated = 0;

    for (const category of categories) {
      console.log(`📝 Creating posts for category: ${category.name}`);
      
      const postsForCategory = [];
      
      for (let i = 0; i < 10; i++) {
        const title = `${postTitles[i]} - ${category.name}`;
        const slug = createSlug(title, Date.now() + i);
        
        // Check if post with this slug already exists
        const existingPost = await postRepo.findOne({ where: { slug } });
        if (existingPost) {
          console.log(`  ⚠️  Post with slug "${slug}" already exists, skipping...`);
          continue;
        }

        const randomUser = nonAdminUsers[Math.floor(Math.random() * nonAdminUsers.length)];
        const featuredImage = getUnsplashImage(800, 600);
        
        const postData = {
          title,
          slug,
          content: `${postContents[i]}\n\nThis post is specifically about ${category.name} and covers important aspects that every developer should understand. ${postContents[i]}`,
          user_id: randomUser.id,
          category_id: category.id,
          status: PostStatus.PUBLISHED,
          featured_image: featuredImage,
          views_count: Math.floor(Math.random() * 500) + 50,
          likes_count: Math.floor(Math.random() * 100) + 10,
          comments_count: Math.floor(Math.random() * 20) + 1,
          published_at: randomDate(),
        };

        postsForCategory.push(postData);
      }

      if (postsForCategory.length > 0) {
        const savedPosts = await postRepo.save(postsForCategory);
        totalPostsCreated += savedPosts.length;
        console.log(`  ✓ Created ${savedPosts.length} posts for ${category.name}`);
      }
    }

    console.log(`\n✅ Seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Categories processed: ${categories.length}`);
    console.log(`   - Total posts created: ${totalPostsCreated}`);
    console.log(`   - Posts per category: ~10`);
    console.log(`   - Featured images: Unsplash random images\n`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

if (require.main === module) {
  seedPostsPerCategory();
}

export default seedPostsPerCategory;