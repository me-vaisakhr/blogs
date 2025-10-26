export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Terms of Use
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
              Thanks for visiting my blog! These terms are pretty simple because I believe in keeping things
              straightforward and accessible. This is a personal blog where I share my journey in software development,
              and I'm happy you're here.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Use My Content Freely
            </h2>
            <p className="mb-4">
              All the blog posts, code snippets, and examples I share here are meant to help you learn and grow.
              You're welcome to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Use the code examples in your projects (personal or commercial)</li>
              <li>Share the articles with others who might find them helpful</li>
              <li>Learn from the techniques and apply them in your work</li>
              <li>Reference or link back to posts in your own writing</li>
            </ul>
            <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
              Don't misuse it, but feel free to use it anywhere. I'll be genuinely happy if what I share here
              makes a positive difference in your journey as a developer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Attribution (Nice but Not Required)
            </h2>
            <p className="mb-4">
              While you don't have to, I'd appreciate if you could mention where you found helpful content.
              A simple link back or acknowledgment helps others discover these resources too. But again,
              this is just a nice-to-have, not a requirement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Interactive Features and Feedback
            </h2>
            <p className="mb-4">
              This blog includes interactive features to help improve the content experience:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Post Ratings:</strong> You can rate posts using the star/emoji rating system (1-5 stars).
                Your ratings are anonymous and help me understand which content is most valuable.</li>
              <li><strong>Analytics:</strong> The site tracks anonymous reading behavior (scroll depth, time on page, etc.)
                to improve content quality. See the Privacy Policy for full details.</li>
            </ul>
            <p className="mb-4">
              By using these features, you agree to the data collection practices described in the Privacy Policy.
              All feedback and ratings you submit become part of the site's analytics data and may be used to
              improve future content.
            </p>
            <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
              Your participation is completely optional - you can enjoy all blog content without rating or
              interacting with any features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What I Don't Want
            </h2>
            <p className="mb-4">
              There are only a few things I'd rather you not do:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Don't copy entire articles word-for-word and claim them as your own</li>
              <li>Don't use the content to mislead or harm others</li>
              <li>Don't republish the entire blog elsewhere without substantial modification</li>
            </ul>
            <p className="mb-4">
              Basically, be a good human. Use what helps you, give credit when appropriate, and don't be malicious.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No Warranties
            </h2>
            <p className="mb-4">
              Everything I share is based on my personal experience and understanding. While I try to be accurate
              and helpful, I'm also learning as I go. The content is provided "as is" without warranties of any kind.
              Always test code in your own environment and use your best judgment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Third-Party Links and Embeds
            </h2>
            <p className="mb-4">
              Posts may include links to external sites and embedded content (like CodeSandbox demos).
              I'm not responsible for the content or practices of those external resources.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Changes to These Terms
            </h2>
            <p className="mb-4">
              As the blog evolves, these terms might need updating. If that happens, I'll update the date
              at the top of this page. Significant changes will be mentioned in a blog post.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Questions or Feedback?
            </h2>
            <p className="mb-4">
              If you have questions about these terms, or just want to chat about code, feel free to reach
              out through any of the social media links in the footer. I'm always happy to connect with
              fellow developers!
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              The spirit of these terms: Share knowledge freely, help each other grow, and build cool things together.
              If you're using what I share to learn and improve, you're doing exactly what I hoped for.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
