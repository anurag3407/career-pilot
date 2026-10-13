import React from 'react';
import { ChefHat, Clock, Users, Star, ArrowRight } from 'lucide-react';

const recipes = [
  {
    id: 1,
    title: "Truffle Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms, finished with white truffle oil and aged parmesan.",
    prepTime: "45 mins",
    servings: "2",
    rating: "4.9",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Pan-Seared Scallops",
    description: "Jumbo sea scallops with cauliflower purée, crispy pancetta, and lemon butter sauce.",
    prepTime: "30 mins",
    servings: "4",
    rating: "4.8",
    category: "Appetizer",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Dark Chocolate Fondant",
    description: "Warm chocolate cake with a molten center, served with Madagascar vanilla bean ice cream.",
    prepTime: "25 mins",
    servings: "2",
    rating: "5.0",
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
  }
];

export default function RecipeCards() {
  return (
    <section className="w-full py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-[#c5a880]"></div>
            <ChefHat className="w-6 h-6 text-[#c5a880]" />
            <div className="h-[1px] w-12 bg-[#c5a880]"></div>
          </div>
          <span className="text-[#c5a880] font-medium tracking-[0.2em] uppercase text-xs mb-4 block">Signature Dishes</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 font-light tracking-wide">Our Masterpiece Recipes</h2>
          <p className="text-gray-400 text-lg font-light leading-relaxed">Experience the art of fine dining with our meticulously crafted culinary creations, designed to delight the senses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              className="group relative bg-[#111111] overflow-hidden transition-all duration-500 border border-[#222222] hover:border-[#c5a880]/50 flex flex-col"
            >
              <div className="h-64 w-full relative overflow-hidden bg-[#0a0a0a]">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000 ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-6 left-6 bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-1.5 border border-[#c5a880]/30">
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#c5a880]">
                    {recipe.category}
                  </span>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1.5 text-[#c5a880]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-sm font-medium text-gray-300">{recipe.rating}</span>
                  </div>
                </div>

                <h3 className="text-3xl font-serif text-white mb-4 font-light tracking-wide group-hover:text-[#c5a880] transition-colors duration-300">
                  {recipe.title}
                </h3>
                
                <p className="text-gray-400 mb-8 flex-grow font-light leading-relaxed">
                  {recipe.description}
                </p>

                <div className="grid grid-cols-2 gap-6 py-6 border-t border-[#222222] mb-8">
                  <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors duration-300">
                    <Clock className="w-4 h-4 text-[#c5a880]" />
                    <span className="text-sm font-light tracking-wider">{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors duration-300">
                    <Users className="w-4 h-4 text-[#c5a880]" />
                    <span className="text-sm font-light tracking-wider">Serves {recipe.servings}</span>
                  </div>
                </div>

                <button type="button" className="flex items-center gap-3 text-[#c5a880] font-medium tracking-widest uppercase text-xs group/btn w-fit overflow-hidden">
                  <span className="relative z-10">View Recipe</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300 relative z-10" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
