import { registerArticle } from './services/register'
import { FetchUserCasts } from './services/feed'
import { FetchReactions } from './services/reactions'
import { MemoryService } from './services/memory'
import { ArticleGenerator } from './services/article'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { SimilarityService } from './services/analytics'
import { AnalyticsDB } from './database/sqlite3'

dotenv.config()

async function getLatestArticlePath(): Promise<string> {
    const articlesDir = 'articles'
    try {
        const files = await fs.readdir(articlesDir)
        if (files.length === 0) {
            throw new Error('No articles found in the articles directory')
        }
        
        // Get the most recently created file
        const filePaths = files.map(file => path.join(articlesDir, file))
        const fileStats = await Promise.all(
            filePaths.map(async filePath => ({
                path: filePath,
                stat: await fs.stat(filePath)
            }))
        )
        
        const latestFile = fileStats.reduce((latest, current) => {
            return latest.stat.mtime > current.stat.mtime ? latest : current
        })
        
        return latestFile.path
    } catch (error) {
        throw new Error(`Failed to get latest article: ${error}`)
    }
}

async function main() {
    // Get title from command line arguments
    const userid = process.argv[2]
    const title = process.argv[3]
    
    if (!userid || !title) {
        console.error('Please provide a userid and title: npm run register "Your Article Title"')
        process.exit(1)
    }

    try {
        // Step 1a: Fetch user's feed for long-term memory
        const feedService = new FetchUserCasts(userid)
        const casts = await feedService.getUserCasts()

        // Step 1b: Fetch user's reactions for short-term memory
        const reactionsService = new FetchReactions()
        const reactions = await reactionsService.getLikedCasts()
        
        // Step 2: Process memories
        const memoryService = new MemoryService()
        const longTermCollection = await memoryService.processLongTermMemory(casts)
        const shortTermCollection = await memoryService.processShortTermMemory(casts)

        // Step 3: Calculate similarities
        const analyticsDB = new AnalyticsDB()
        const similarityService = new SimilarityService(longTermCollection, shortTermCollection, analyticsDB)
        await similarityService.updateSimilarityScore()

        // Step 4: Generate article
        const articleGenerator = new ArticleGenerator(longTermCollection, shortTermCollection)
        await articleGenerator.generateArticle()
        
        // Step 5: Get the latest article path
        const articlePath = await getLatestArticlePath()
        const description = `Article generated on ${new Date().toISOString()}`
        const creatorAddress = process.env.WALLET_ADDRESS as string

        const response = await registerArticle(
            articlePath,
            title,
            description,
            creatorAddress
        )

        console.log('Registration successful!')
        console.log(`View your IP Asset at: https://explorer.story.foundation/ipa/${response.ipId}`)
        console.log(`Article path: ${articlePath}`)

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message)
        } else {
            console.error('An unknown error occurred:', error)
        }
    }
}

main()