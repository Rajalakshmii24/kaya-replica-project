import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "Dubai Real Estate Market Trends 2025",
    excerpt: "Explore the latest trends shaping Dubai's dynamic real estate landscape and what they mean for investors.",
    date: "February 15, 2025",
    image: "/images/downtown-living.webp",
  },
  {
    id: 2,
    title: "Top 5 Areas for Property Investment in Dubai",
    excerpt: "Discover the most promising neighborhoods for real estate investment with high ROI potential.",
    date: "January 28, 2025",
    image: "/images/marine-living.webp",
  },
  {
    id: 3,
    title: "Guide to Buying Off-Plan Property in Dubai",
    excerpt: "Everything you need to know about investing in off-plan properties, from payment plans to legal requirements.",
    date: "January 10, 2025",
    image: "/images/luxury-apartments.jpg",
  },
  {
    id: 4,
    title: "Understanding Dubai's Golden Visa Through Property",
    excerpt: "Learn how property investment can qualify you for the UAE's sought-after Golden Visa residency program.",
    date: "December 20, 2024",
    image: "/images/residential-community.webp",
  },
];

const Blog = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Blog" subtitle="Insights & Market Updates" />

      <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <Link key={post.id} to="/contact" className="group block">
              <div className="overflow-hidden mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">
                {post.date}
              </p>
              <h3 className="font-raleway font-light tracking-[0.1em] text-lg text-foreground mb-2 group-hover:text-kaya-olive transition-colors">
                {post.title}
              </h3>
              <p className="kaya-body text-sm">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
