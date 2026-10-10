export function slugify(text) {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getBlogUrl(blog) {
  if (!blog) return '/blogs'
  const slug = blog.slug || slugify(blog.title) || blog.id
  return `/blog/${slug}`
}
