import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  User,
  Plus,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const { data } = await api.get("/blogs", { params });

      setBlogs(data.blogs ?? []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Unknown";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-green-600" />
            Food Blogs
          </h1>

          <p className="text-gray-600 text-lg">
            Discover delicious recipes, cooking tips, and culinary stories from
            our community.
          </p>
        </div>

        {/* Search + Button */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

            <Input
              placeholder="Search blogs by title, ingredients, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 rounded-2xl border-2 border-green-200 focus-visible:ring-green-500 focus-visible:border-green-500 text-lg shadow-lg"
            />
          </div>

          {user && (
            <Link to="/blogs/write">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg whitespace-nowrap">
                <Plus className="h-5 w-5 mr-2" />
                Write New Blog
              </Button>
            </Link>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.id}`}>
                    <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-none bg-white shadow-xl rounded-3xl h-full flex flex-col">

                      {blog.image && (
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      )}

                      <CardHeader className="p-6 pb-2">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors">
                          {blog.title}
                        </h3>
                      </CardHeader>

                      <CardContent className="p-6 pt-2 flex-grow">
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {blog.content}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-green-600" />
                            {blog.author?.username || "Unknown Author"}
                          </div>

                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-green-600" />
                            {formatDate(blog.createdAt)}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
                          Read More
                        </Button>
                      </CardFooter>

                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="h-20 w-20 mx-auto text-gray-300 mb-4" />

                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No blogs found
                </h3>

                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Be the first to share a culinary story!"}
                </p>

                {user && !searchQuery && (
                  <Link to="/blogs/write">
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl">
                      <Plus className="h-5 w-5 mr-2" />
                      Write Your First Blog
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}