import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Star, Leaf, Flame, Utensils, Zap, Calendar } from 'lucide-react'
import { Button } from '../components/ui/button'

const menuItems = [
  { id: 1, title: 'Spicy Avocado Toast', category: 'breakfast', prepTime: 10, difficulty: 'Easy', price: 12.99, rating: 4.8, description: 'Fresh sliced avocado on toasted sourdough, topped with chili flakes, poached egg, and a dash of lime juice.', ingredients: ['Sourdough Bread', 'Avocado', 'Egg', 'Chili Flakes', 'Lime'], image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3' },
  { id: 2, title: 'Gourmet Beef Burger', category: 'lunch', prepTime: 25, difficulty: 'Medium', price: 18.50, rating: 4.9, description: 'Half-pound premium beef patty with cheddar cheese, caramelized onions, and our secret house sauce.', ingredients: ['Beef Patty', 'Cheddar Cheese', 'Brioche Bun', 'Onions', 'Secret Sauce'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3' },
  { id: 3, title: 'Pan-Seared Salmon', category: 'dinner', prepTime: 20, difficulty: 'Medium', price: 24.00, rating: 4.7, description: 'Atlantic salmon fillet seared to perfection, served with garlic butter roasted seasonal vegetables.', ingredients: ['Salmon Fillet', 'Garlic Butter', 'Asparagus', 'Lemon'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3' },
  { id: 4, title: 'Vegan Tomato Soup', category: 'soups', prepTime: 30, difficulty: 'Easy', price: 9.99, rating: 4.6, description: 'Rich, creamy roasted tomato soup infused with fresh basil and served with crusty croutons.', ingredients: ['Tomatoes', 'Basil', 'Vegetable Stock', 'Coconut Cream'], image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3' },
  { id: 5, title: 'Classic Pancakes', category: 'breakfast', prepTime: 15, difficulty: 'Easy', price: 8.99, rating: 4.5, description: 'Fluffy buttermilk pancakes served with maple syrup and fresh seasonal berries.', ingredients: ['Flour', 'Buttermilk', 'Blueberries', 'Maple Syrup'], image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?ixlib=rb-4.0.3' },
  { id: 6, title: 'Chicken Caesar Salad', category: 'lunch', prepTime: 15, difficulty: 'Easy', price: 14.50, rating: 4.4, description: 'Crisp romaine lettuce, grilled chicken breast, parmesan cheese, and creamy caesar dressing.', ingredients: ['Romaine Lettuce', 'Grilled Chicken', 'Parmesan', 'Croutons'], image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3' },
  { id: 7, title: 'Pasta Primavera', category: 'dinner', prepTime: 25, difficulty: 'Medium', price: 16.99, rating: 4.6, description: 'Fresh garden vegetables sautéed with garlic and tossed with penne pasta in a light herb sauce.', ingredients: ['Penne Pasta', 'Zucchini', 'Bell Peppers', 'Garlic', 'Herbs'], image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-4.0.3' },
  { id: 8, title: 'Lentil Stew', category: 'soups', prepTime: 40, difficulty: 'Medium', price: 11.50, rating: 4.3, description: 'Hearty slow-cooked lentil stew with carrots, celery, and savory spices.', ingredients: ['Lentils', 'Carrots', 'Celery', 'Cumin', 'Thyme'], image: 'https://images.unsplash.com/photo-1547592115-f9a888800171?ixlib=rb-4.0.3' },
  { id: 9, title: 'Eggs Benedict', category: 'breakfast', prepTime: 20, difficulty: 'Medium', price: 13.99, rating: 4.7, description: 'English muffins topped with Canadian bacon, poached eggs, and buttery hollandaise sauce.', ingredients: ['English Muffin', 'Poached Egg', 'Bacon', 'Hollandaise Sauce'], image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3' },
  { id: 10, title: 'Fish & Chips', category: 'lunch', prepTime: 30, difficulty: 'Hard', price: 15.99, rating: 4.8, description: 'Beer-battered cod served with thick-cut fries, tartar sauce, and mushy peas.', ingredients: ['Cod Fillet', 'Potatoes', 'Beer Batter', 'Tartar Sauce'], image: 'https://images.unsplash.com/photo-1524339100590-a2e0ecd6ac9d?ixlib=rb-4.0.3' },
  { id: 11, title: 'Beef Steak', category: 'dinner', prepTime: 25, difficulty: 'Hard', price: 29.99, rating: 4.9, description: 'Prime ribeye steak grilled to your liking with rosemary garlic butter.', ingredients: ['Ribeye Steak', 'Garlic Butter', 'Rosemary', 'Black Pepper'], image: 'https://images.unsplash.com/photo-1606416132922-22ab37c1231e?ixlib=rb-4.0.3' },
  { id: 12, title: 'Mushroom Cream Soup', category: 'soups', prepTime: 20, difficulty: 'Easy', price: 10.50, rating: 4.5, description: 'A velvety blend of wild mushrooms and cream, garnished with fresh thyme.', ingredients: ['Wild Mushrooms', 'Heavy Cream', 'Vegetable Broth', 'Onion'], image: 'https://images.unsplash.com/photo-1547592115-f9a888800171?ixlib=rb-4.0.3' },
];

export default function DishDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dish = menuItems.find(item => item.id === parseInt(id));

  if (!dish) return <div>Dish not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="relative h-[400px]">
        <img src={dish.image} alt={dish.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <Button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 p-0"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto w-full -mt-20 relative z-10 px-4 pb-12">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                    {dish.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic tracking-tighter">
                    {dish.title}
                </h1>
              </div>
              <div className="bg-yellow-400 px-6 py-2 rounded-2xl shadow-xl">
                 <span className="text-2xl font-black text-slate-900">${dish.price}</span>
              </div>
           </div>

           <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Backing Time: {dish.prepTime}m</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Rating: {dish.rating} / 5</span>
              </div>
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Difficulty: {dish.difficulty}</span>
              </div>
           </div>

           <div className="mb-10">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[3px] mb-4 flex items-center">
                 <Leaf className="h-4 w-4 mr-2 text-green-500" /> Description
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium capitalize italic">
                 {dish.description}
              </p>
           </div>

           <div className="mb-12">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[3px] mb-4 flex items-center">
                 <Flame className="h-4 w-4 mr-2 text-red-500" /> Ingredients
              </h3>
              <div className="flex flex-wrap gap-3">
                 {dish.ingredients.map((ing, i) => (
                    <span key={i} className="px-5 py-2 bg-slate-100 rounded-xl text-slate-700 font-bold text-sm shadow-sm">
                        {ing}
                    </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
