import { query } from '@/lib/db';

export async function getFeedbackMetrics() {
    const queries = [
        // 1. Total Reviews
        query(`SELECT COUNT(*) as value FROM product_feedback`),

        // 2. Avg Rating
        query(`SELECT AVG(rating) as value FROM product_feedback`),

        // 3. Positive Feedback Count (Sentiment='HAPPY' or Rating >= 4)
        query(`SELECT COUNT(*) as value FROM product_feedback WHERE sentiment = 'HAPPY' OR rating >= 4`),

        // 4. Negative Feedback Count
        query(`SELECT COUNT(*) as value FROM product_feedback WHERE sentiment = 'SAD' OR rating <= 2`),

        // 5. Highest Rated Product
        query(`
        SELECT p.name as name, AVG(f.rating) as val
        FROM product_feedback f JOIN products p ON f.product_id = p.product_id
        GROUP BY p.name ORDER BY val DESC LIMIT 1
    `),

        // 6. Lowest Rated Product
        query(`
        SELECT p.name as name, AVG(f.rating) as val
        FROM product_feedback f JOIN products p ON f.product_id = p.product_id
        GROUP BY p.name ORDER BY val ASC LIMIT 1
    `),

        // 7. Most Common Complaint Type (Keyword Matching)
        query(`
        SELECT 
            CASE 
                WHEN comment ILIKE '%delivery%' OR comment ILIKE '%late%' THEN 'Delivery Issue'
                WHEN comment ILIKE '%quality%' OR comment ILIKE '%broke%' OR comment ILIKE '%damage%' THEN 'Quality Issue'
                WHEN comment ILIKE '%size%' OR comment ILIKE '%fit%' THEN 'Sizing Issue'
                WHEN comment ILIKE '%fake%' OR comment ILIKE '%authentic%' THEN 'Authenticity'
                WHEN comment ILIKE '%price%' OR comment ILIKE '%expensive%' THEN 'Pricing'
                ELSE 'Other'
            END as type,
            COUNT(*) as cnt
        FROM product_feedback
        WHERE sentiment = 'SAD' OR rating <= 2
        GROUP BY type
        ORDER BY cnt DESC
        LIMIT 1
    `)
    ];

    const results = await Promise.all(queries);

    return {
        totalReviews: parseInt(results[0].rows[0]?.value || '0'),
        avgRating: parseFloat(results[1].rows[0]?.value || '0'),
        positiveCount: parseInt(results[2].rows[0]?.value || '0'),
        negativeCount: parseInt(results[3].rows[0]?.value || '0'),
        highestRated: results[4].rows[0]?.name || 'N/A',
        lowestRated: results[5].rows[0]?.name || 'N/A',
        commonComplaint: results[6].rows[0]?.type || 'N/A'
    };
}

export async function getFeedbackGraphs() {
    const queries = [
        // 1. Rating Distribution
        query(`
        SELECT rating, COUNT(*) as cnt
        FROM product_feedback
        GROUP BY rating
        ORDER BY rating ASC
    `),

        // 2. Sentiment Trend (Daily, since data is concentrated in one month)
        query(`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date,
               sentiment,
               COUNT(*) as cnt
        FROM product_feedback
        GROUP BY date, sentiment
        ORDER BY date ASC
    `),

        // 3. Negative Feedback by Category
        query(`
        SELECT p.category, COUNT(*) as cnt
        FROM product_feedback f
        JOIN products p ON f.product_id = p.product_id
        WHERE f.sentiment = 'SAD' OR f.rating <= 2
        GROUP BY p.category
        ORDER BY cnt DESC
        LIMIT 10
    `),

        // 4. Top Complaints by Product (Products with most negative reviews)
        query(`
        SELECT p.name, COUNT(*) as cnt
        FROM product_feedback f
        JOIN products p ON f.product_id = p.product_id
        WHERE f.sentiment = 'SAD' OR f.rating <= 2
        GROUP BY p.name
        ORDER BY cnt DESC
        LIMIT 10
    `)
    ];

    const results = await Promise.all(queries);

    // Process Sentiment Trend into generic LineChart format
    const sentimentRaw = results[1].rows;
    const sentimentMap = new Map();

    sentimentRaw.forEach((r: any) => {
        // Use 'date' instead of 'month'
        if (!sentimentMap.has(r.date)) sentimentMap.set(r.date, { date: r.date, Positive: 0, Neutral: 0, Negative: 0 });
        const entry = sentimentMap.get(r.date);

        let s = 'Neutral';
        if (r.sentiment === 'HAPPY') s = 'Positive';
        else if (r.sentiment === 'SAD') s = 'Negative';
        else if (r.sentiment === 'NEUTRAL') s = 'Neutral';

        if (entry[s] !== undefined) {
            entry[s] = parseInt(r.cnt);
        }
    });

    return {
        ratingDist: results[0].rows.map((r: any) => ({ name: `${r.rating} Stars`, value: parseInt(r.cnt) })),
        sentimentTrend: Array.from(sentimentMap.values()).sort((a: any, b: any) => a.date.localeCompare(b.date)),
        negativeByCategory: results[2].rows.map((r: any) => ({ name: r.category, value: parseInt(r.cnt) })),
        complaintsByProduct: results[3].rows.map((r: any) => ({ name: r.name, value: parseInt(r.cnt) }))
    };
}

export async function getFeedbackInsights() {
    // Re-use aggregation logic for summary texts
    const metrics = await getFeedbackMetrics();

    // Get growth/decline
    // Compare last month negative count vs previous?
    // Simplify: Just return static insights based on metrics for now, or simple queries.

    return {
        highestRated: metrics.highestRated,
        lowestRated: metrics.lowestRated,
        commonComplaint: metrics.commonComplaint,
        summary: `Sentiment analysis shows ${metrics.positiveCount > metrics.negativeCount ? 'overwhelmingly positive' : 'mixed'} feedback. The primary pain point is "${metrics.commonComplaint}".`
    };
}
