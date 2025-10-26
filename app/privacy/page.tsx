export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: October 26, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome!
            </h2>
            <p className="mb-4">
              This blog is a personal space where I share my thoughts, learnings, and experiences in software development.
              Your privacy matters to me, and I want to be completely transparent about how this site works and what data
              is collected to improve your reading experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What I Collect and Why
            </h2>
            <p className="mb-4">
              To understand how readers engage with my content and improve the blog experience, I collect anonymous
              analytics data. Here's exactly what is tracked:
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                1. Reading Analytics
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Page Views:</strong> Which posts you visit and when</li>
                <li><strong>Reading Behavior:</strong> How far you scroll through articles (25%, 50%, 75%, 100%)</li>
                <li><strong>Time on Page:</strong> How long you spend reading each post</li>
                <li><strong>Exit Position:</strong> Where you stop reading before leaving</li>
                <li><strong>Session ID:</strong> A randomly generated identifier to track your visit session (not personally identifiable)</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Why: This helps me understand which content resonates with readers and how to improve my writing.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                2. Feedback and Ratings
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Star Ratings:</strong> If you choose to rate a post (1-5 stars), that rating is stored</li>
                <li><strong>Session ID:</strong> Used to prevent duplicate ratings from the same reading session</li>
                <li><strong>Timestamp:</strong> When you submitted the rating</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Why: Your feedback helps me understand what content is most valuable and guides future posts.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                3. Technical Information
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>User Agent:</strong> Your browser type and operating system (e.g., "Chrome on macOS")</li>
                <li><strong>Timestamps:</strong> When events occur (in UTC timezone)</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Why: Helps ensure the blog works well across different browsers and devices.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What I Don't Collect
            </h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>No personally identifiable information (name, email, phone number)</li>
              <li>No IP addresses are stored in the analytics database</li>
              <li>No login or registration system</li>
              <li>No newsletter or email collection</li>
              <li>No third-party advertising trackers</li>
              <li>No social media tracking pixels</li>
            </ul>
            <p className="mb-4">
              All analytics are <strong>anonymous and aggregated</strong>. I cannot identify individual visitors or
              connect your reading behavior to your real identity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Cookies and Local Storage
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Browser Local Storage
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Theme Preference:</strong> Your dark/light mode choice is saved locally to remember your preference</li>
                <li><strong>Session Tracking:</strong> A temporary session identifier is stored in your browser's sessionStorage
                  (automatically cleared when you close your browser)</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                This data never leaves your device except for the anonymous session ID sent with analytics data.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Traditional Cookies
              </h3>
              <p className="mb-4">
                This blog does <strong>not use traditional HTTP cookies</strong> for tracking. All session management
                happens through browser sessionStorage, which is more privacy-friendly.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Where Your Data is Stored
            </h2>
            <p className="mb-4">
              Analytics data is stored securely in a PostgreSQL database hosted on Vercel's infrastructure. The data includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Encrypted connections (HTTPS/TLS) for all data transmission</li>
              <li>Access restricted to the blog owner only (password-protected dashboard)</li>
              <li>Regular database backups maintained by Vercel</li>
              <li>Data stored in compliance with Vercel's security standards</li>
            </ul>
            <p className="mb-4">
              For more information about Vercel's data practices, visit their{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Data Retention
            </h2>
            <p className="mb-4">
              Analytics data is retained indefinitely to help me track long-term content performance and trends.
              However, because all data is anonymous (no personal information), there's no risk to your privacy
              even with long-term storage.
            </p>
            <p className="mb-4">
              Session IDs are randomly generated and cannot be traced back to you personally.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your Rights and Choices
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                You Have the Right To:
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Browse Without Tracking:</strong> While analytics are automatically collected, you can use
                  browser extensions or privacy settings to block tracking if you prefer</li>
                <li><strong>Clear Local Data:</strong> Clear your browser's localStorage/sessionStorage at any time
                  to remove theme preferences and session data</li>
                <li><strong>Request Data Deletion:</strong> Contact me to request deletion of analytics data
                  (though it's anonymous and cannot be tied to you specifically)</li>
                <li><strong>Ask Questions:</strong> Reach out anytime to understand what data is collected</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Opt-Out Options:
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Use browser privacy features like "Do Not Track" (honored by this site)</li>
                <li>Disable JavaScript (though this will affect the reading experience)</li>
                <li>Use ad blockers or privacy extensions that block analytics</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              External Links
            </h2>
            <p className="mb-4">
              This blog contains links to external websites and social media platforms (GitHub, X, Bluesky, CodePen, LinkedIn).
              When you click on these links, you'll be subject to those platforms' privacy policies, not mine.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Embedded Content
            </h2>
            <p className="mb-4">
              Some blog posts may include embedded content from platforms like CodeSandbox. These embeds may use cookies
              or track usage according to their own privacy policies. I have no control over data collected by these
              third-party embeds.
            </p>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 italic">
              Examples: CodeSandbox, YouTube, or other interactive demos may collect their own analytics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Children's Privacy
            </h2>
            <p className="mb-4">
              This blog is not directed at children under the age of 13. I do not knowingly collect data from children.
              If you believe a child has provided data to this site, please contact me so I can delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Changes to This Policy
            </h2>
            <p className="mb-4">
              As the blog evolves, this privacy policy may be updated. When changes are made:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The "Last updated" date at the top will be changed</li>
              <li>Significant changes will be announced in a blog post</li>
              <li>I'll always maintain transparency about what data is collected</li>
            </ul>
            <p className="mb-4">
              I encourage you to review this policy periodically to stay informed about how your data is handled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              International Users
            </h2>
            <p className="mb-4">
              This blog is hosted on Vercel's global infrastructure. If you're accessing this site from outside
              the United States, please note that your data may be transferred to and processed in countries
              where Vercel operates data centers.
            </p>
            <p className="mb-4">
              For users in the EU/EEA: While this is a personal blog and may not be subject to GDPR, I've designed
              the analytics system to be privacy-friendly and collect only anonymous data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Contact Me
            </h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests about privacy or your data, feel free to reach out
              through any of the social media links in the footer. I'm always happy to chat and clarify anything!
            </p>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              You can find me on: GitHub, X/Twitter, Bluesky, CodePen, or LinkedIn.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              <strong>The Bottom Line:</strong> I collect anonymous analytics to understand what content helps readers,
              but I don't collect personal information or sell data to anyone. Your privacy is respected, and
              transparency is a core value of this blog. If you have concerns or questions, please reach out - I'm
              always happy to explain or improve.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
