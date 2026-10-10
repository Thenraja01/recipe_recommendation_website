const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const foodBlogs = [
  {
    title: 'The Secret to Authentic Neapolitan Pizza: 72-Hour Cold Fermentation',
    content: 'Nothing compares to the smell of bubbly, blistered pizza emerging from a blistering wood-fired oven. The true secret isn’t a secret ingredient—it is time. By allowing the dough to ferment in the refrigerator for 72 hours, enzymes break down starches into complex sugars, creating unmatched flavor depth, an airy cornicione (crust), and effortless digestibility.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80',
    ingredients: '• 500g Tipo 00 Flour\n• 325ml Ice Cold Water (65% hydration)\n• 1.5g Active Dry Yeast\n• 15g Fine Sea Salt\n• 1 can San Marzano Tomatoes (DOP)\n• 250g Fresh Fior di Latte Mozzarella\n• Fresh Basil Leaves\n• Extra Virgin Olive Oil',
    instructions: '1. Dissolve yeast in cold water. Gradually incorporate 00 flour and knead for 10 minutes until gluten develops.\n2. Add salt during the final minutes of kneading. Rest for 30 minutes at room temperature.\n3. Portion into 250g dough balls, place in an airtight container, and ferment in the fridge for 48 to 72 hours.\n4. Bring to room temp 2 hours before stretching. Stretch by hand without rolling pins to protect the air bubbles.\n5. Top with crushed San Marzano tomatoes, sliced mozzarella, and fresh basil.\n6. Bake at maximum oven temperature (or pizza oven at 450°C) on a preheated pizza stone for 90 seconds to 5 minutes until leopard-spotted.',
    recipeHistory: 'Originating in Naples, Italy in the late 18th century, Neapolitan pizza was traditionally the food of working-class citizens. When Queen Margherita visited in 1889, pizzaiolo Raffaele Esposito created the tri-color pizza representing the Italian flag with tomatoes, mozzarella, and basil.',
  },
  {
    title: 'Mastering Classic French Bouillabaisse: A Fisherman’s Tale',
    content: 'Bouillabaisse is more than a seafood stew—it is a sacred maritime tradition born in the sun-drenched port city of Marseille. Fishermen originally simmered unsold bony rockfish in sea water with saffron, wild fennel, and orange peel. Today, it remains one of the world’s most celebrated culinary masterpieces when paired with garlic rouille.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&q=80',
    ingredients: '• 1.2kg Mixed Fresh Fish (Cod, Red Snapper, Halibut, Sea Bass)\n• 300g Shellfish (Mussels and Prawns)\n• 1 large Fennel bulb, thinly sliced\n• 1 Leek, white part only\n• 4 cloves Garlic, minced\n• 1 generous pinch Saffron threads\n• 1 strip Dried Orange Peel\n• 400g Ripe Tomatoes, crushed\n• 200ml Dry White Wine\n• 1 liter Homemade Fish Stock\n• Crusty Baguette & Garlic Rouille for serving',
    instructions: '1. In a heavy Dutch oven, heat olive oil and sweat fennel, leek, and onions until translucent.\n2. Add garlic, crushed tomatoes, saffron, orange peel, and white wine. Simmer vigorously for 5 minutes.\n3. Pour in fish stock and bring to a rolling boil—the rapid boil is essential to emulsify olive oil and stock into a rich broth.\n4. Add firm-fleshed fish first, followed by tender fillets and shellfish 5 minutes later.\n5. Cook until mussels open and fish is tender and flaky (about 8–10 minutes total).\n6. Serve broth in wide bowls alongside fish, accompanied by toasted baguette rubbed with raw garlic and slathered with rouille.',
    recipeHistory: 'First created by Marseille fishermen using "rascasse" (rockfish) that could not be sold in markets. The word "Bouillabaisse" comes from Provençal Occitan: "bolhir" (to boil) and "abaissar" (to reduce heat).',
  },
  {
    title: 'Japanese Tonkotsu Ramen: The 12-Hour Rich Broth Journey',
    content: 'Achieving the legendary milky, unctuous Tonkotsu broth requires patience and relentless simmering. The secret lies in blanching pork bones thoroughly to remove impurities, followed by an aggressive 12-hour rolling boil that extracts every ounce of collagen and marrow, transforming water into pure culinary velvet.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=80',
    ingredients: '• 2kg Pork Trotters and Femur Bones\n• 1 Onion, halved and charred\n• 1 head Garlic, sliced in half\n• 50g Fresh Ginger, bruised\n• 4 Spring Onions\n• Shoyu Tare: Soy sauce, Mirin, Sake, Kombu\n• Fresh Ramen Noodles\n• Chashu Pork Belly Slices\n• Ajitsuke Tamago (Marinated soft-boiled eggs)\n• Menma (Bamboo shoots) and Nori seaweed',
    instructions: '1. Soak bones in cold water for 2 hours. Bring to a rolling boil for 15 minutes, then discard all water and scrub bones clean.\n2. Return cleaned bones to a large pot, cover with fresh water, and boil vigorously uncovered for 10 to 12 hours. Top up water periodically.\n3. In the final 2 hours, add charred onion, garlic, ginger, and spring onions.\n4. Strain through a fine-mesh sieve, pressing out all gelatinous broth. The broth should be milky white and opaque.\n5. Warm your bowls, add 2 tablespoons of Shoyu Tare, ladle in boiling Tonkotsu broth, and fold in cooked alkaline noodles.\n6. Top with tender chashu, halved ramen egg, green scallions, menma, and nori sheets.',
    recipeHistory: 'Tonkotsu ramen originated in Kurume, Fukuoka Prefecture on Japan’s southern island of Kyushu in 1937, where a broth was accidentally boiled too hard and turned milky white—creating an instant sensation across Japan.',
  },
  {
    title: 'Artisan Sourdough: Understanding Hydration and Wild Yeast',
    content: 'Baking sourdough is a conversation with living microbiology. With just flour, water, salt, and wild yeast captured from the air, you can produce a loaf with an open crumb, blistering crust, and a delightfully tangy flavor profile.',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=1200&q=80',
    ingredients: '• 400g Bread Flour\n• 100g Whole Wheat Flour\n• 375ml Filtered Water (75% hydration)\n• 100g Active Sourdough Starter (at peak)\n• 10g Fine Sea Salt',
    instructions: '1. Autolyse: Mix flours and 350ml water together. Rest for 45 minutes.\n2. Add active starter and remaining 25ml water with salt. Mix thoroughly using the Rubaud method.\n3. Perform 4 sets of stretch and folds spaced 30 minutes apart over a 2-hour bulk fermentation window.\n4. Allow dough to rise until increased by 50% in volume with visible doming.\n5. Pre-shape on an unfloured counter, bench rest 20 minutes, then shape into a tight batard and place in a banneton.\n6. Cold retard in the refrigerator for 14–18 hours.\n7. Score down the center with a razor blade and bake inside a preheated Dutch oven at 230°C with lid on for 20 minutes, then lid off for 22 minutes.',
    recipeHistory: 'Sourdough is the oldest form of leavened bread, dating back to ancient Egypt around 1500 BC. Before commercial yeast was developed in the 19th century, all bread was made using natural wild fermentation.',
  },
  {
    title: 'Smoky Spanish Seafood Paella with Saffron & Bomba Rice',
    content: 'True Valencian paella is celebrated for its incredible texture, fragrant saffron aroma, and the elusive "socarrat"—that prized, caramelized, crispy crust at the bottom of the pan that every diner fights over.',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=1200&q=80',
    ingredients: '• 400g Spanish Bomba Rice (never long grain!)\n• 1 liter Homemade Seafood or Fish Broth\n• 1 pinch Spanish Saffron threads, steeped in warm broth\n• 12 Large Prawns / Gambas\n• 300g Squid / Calamari rings\n• 300g Fresh Mussels\n• 1 Red Bell Pepper, sliced\n• 3 cloves Garlic, grated\n• 2 Ripe Tomatoes, grated\n• 1 tsp Smoked Spanish Paprika (Pimentón)\n• Lemon wedges and Extra Virgin Olive Oil',
    instructions: '1. Heat olive oil in a wide carbon-steel paella pan. Sear prawns until pink, remove and set aside.\n2. In the same oil, sauté sliced pepper and squid until golden.\n3. Make a space in the center, add grated tomatoes, garlic, and smoked paprika. Cook until sofrito thickens and oil separates.\n4. Stir in Bomba rice, coating every grain in the flavorful sofrito for 2 minutes.\n5. Pour in saffron broth evenly. Do NOT stir the rice once it starts simmering!\n6. Cook on medium-high for 10 minutes, then reduce heat to low for 8 minutes. Tuck in mussels and seared prawns.\n7. Increase heat for the final 2 minutes until you hear a crackling sound—the socarrat is forming! Rest 5 minutes before serving.',
    recipeHistory: 'Paella originated around Lake Albufera in Valencia as lunch cooked over open orange-wood fires for farmworkers. The wide, shallow pan ensures liquid evaporates evenly so rice cooks to al-dente perfection.',
  },
  {
    title: 'Creamy Tuscan Garlic Butter Salmon with Charred Asparagus',
    content: 'When you want restaurant elegance in under 30 minutes, this pan-seared Tuscan salmon delivers every time. Crispy golden skin gives way to buttery, flaky salmon bathed in a velvety sauce of garlic, sweet sun-dried tomatoes, baby spinach, and freshly grated Parmesan.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80',
    ingredients: '• 4 Fresh Salmon Fillets (skin-on)\n• 1 tbsp Olive Oil & 2 tbsp Unsalted Butter\n• 4 cloves Garlic, minced\n• 1/2 cup Sun-Dried Tomatoes, drained and sliced\n• 1 cup Heavy Cream\n• 2 cups Fresh Baby Spinach\n• 1/2 cup Freshly Grated Parmigiano-Reggiano\n• 1 bunch Fresh Asparagus, trimmed\n• Fresh Basil and Lemon juice for finishing',
    instructions: '1. Pat salmon dry and season generously with sea salt and black pepper.\n2. Heat olive oil in a stainless-steel skillet over medium-high. Sear salmon skin-side down for 4 minutes until golden and crisp, flip and cook 3 minutes more. Transfer to a plate.\n3. Sauté asparagus in the pan for 3 minutes until tender-crisp; set aside with salmon.\n4. Melt butter in the skillet, add garlic and sun-dried tomatoes, cook 1 minute until fragrant.\n5. Pour in heavy cream and bring to a gentle simmer. Stir in spinach and parmesan cheese until wilted and velvety.\n6. Return salmon and asparagus to the skillet, spoon sauce over fillets, and finish with fresh basil and lemon zest.',
    recipeHistory: 'Inspired by the rustic, dairy-rich trattorias of central Tuscany, this dish fuses Italian coastal seafood appreciation with rich countryside dairy and sun-ripened Mediterranean produce.',
  },
  {
    title: 'The Ultimate Thai Green Curry: Fresh Paste vs Store-Bought',
    content: 'Nothing in a jar can match the vibrant herbal fragrance of fresh green curry paste pounded by hand in a granite mortar. Bird’s eye chilies, wild lemongrass, galangal, and kaffir lime zest unite into a zesty, aromatic green curry that perfumes your entire home.',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80',
    ingredients: '• 500g Chicken Thighs, bite-sized\n• 400ml High-Fat Coconut Milk (divided)\n• 2 tbsp Fresh Thai Green Curry Paste\n• 1 cup Thai Eggplants (quartered)\n• 1 tbsp Palm Sugar\n• 2 tbsp Fish Sauce (Nam Pla)\n• 5 Kaffir Lime Leaves, torn\n• 1 cup Fresh Thai Holy Basil leaves\n• Steamed Jasmine Rice for serving',
    instructions: '1. Spoon the thick coconut cream from top of the can into a heated wok over medium heat. Fry until the oil separates (breaks).\n2. Add the green curry paste and fry vigorously for 3 minutes until aromatic and infused with green coconut oil.\n3. Add chicken thighs and toss until coated in the fragrant paste.\n4. Pour in remaining coconut milk and a splash of water. Bring to a gentle simmer.\n5. Add Thai eggplants, torn kaffir lime leaves, palm sugar, and fish sauce. Simmer for 10 minutes until eggplants are tender.\n6. Turn off the heat and fold in fresh Thai basil leaves immediately. Serve hot over steaming jasmine rice.',
    recipeHistory: 'Known in Thailand as "Gaeng Kiew Wan" (Sweet Green Curry). It was popularized in the early 20th century during the reign of King Rama VI and remains one of Thailand’s signature royal court dishes.',
  },
  {
    title: 'Decadent French Beef Bourguignon: Julia Child’s Comfort Legacy',
    content: 'Slow braising transforms inexpensive beef chuck into spoon-tender morsels enveloped in a glossy, dark red wine reduction. Studded with smoked bacon lardons, sweet glazed pearl onions, and browned cremini mushrooms, this is the ultimate cold-weather feast.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
    ingredients: '• 1.2kg Beef Chuck Roast, cut into 2-inch cubes\n• 150g Thick-Cut Smoked Bacon (lardons)\n• 1 bottle Full-Bodied Red Wine (Pinot Noir or Burgundy)\n• 500ml Rich Beef Stock\n• 2 Carrots and 1 Yellow Onion, sliced\n• 3 cloves Garlic, smashed\n• 2 tbsp Tomato Paste\n• Bouquet Garni: Fresh Thyme, Rosemary, Bay Leaf\n• 250g Pearl Onions, peeled and glazed\n• 300g Cremini Mushrooms, browned in butter',
    instructions: '1. Sauté lardons in a heavy enameled cast iron Dutch oven until crisp. Remove bacon and retain fat.\n2. Thoroughly pat beef cubes dry. Brown in small batches over high heat in the bacon fat until deeply caramelized on all sides. Remove.\n3. Brown sliced carrots and onions in the remaining fat. Stir in tomato paste and garlic for 1 minute.\n4. Return beef and bacon to pot. Dust with 2 tbsp flour and toss. Pour in entire bottle of wine and beef stock to cover.\n5. Add bouquet garni, cover tightly, and braise in a 160°C oven for 3 to 3.5 hours until beef is fork-tender.\n6. Sauté glazed pearl onions and mushrooms separately in butter. Fold into the stew 15 minutes before serving.',
    recipeHistory: 'Originally a peasant dish from the Burgundy region of eastern France, it gained worldwide fame when Julia Child featured it as the cornerstone recipe in her 1961 cookbook "Mastering the Art of French Cooking".',
  },
  {
    title: 'Crispy Truffle Fries with Homemade Garlic Aioli',
    content: 'Taking humble french fries and transforming them into gourmet bistro fare requires the double-fry technique: first frying at a lower temperature to cook the interior potato to fluffy perfection, followed by a hot flash-fry for shattering crunch.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=1200&q=80',
    ingredients: '• 1kg Russet Potatoes (high starch)\n• 2 liters Peanut or Canola Oil for frying\n• 2 tbsp White Truffle Oil\n• 1/2 cup Freshly Grated Parmigiano-Reggiano\n• 2 tbsp Fresh Italian Parsley, finely minced\n• Flaky Sea Salt and Fresh Cracked Black Pepper\n• Aioli: 2 egg yolks, 1 cup olive oil, 3 cloves roasted garlic, lemon juice',
    instructions: '1. Cut potatoes into uniform 1/4-inch matchsticks. Soak in cold water for 1 hour to remove excess surface starch.\n2. Drain and dry completely with kitchen towels.\n3. First fry: Heat oil to 160°C. Fry potato batches for 5 minutes until soft but pale. Drain on paper towels and cool completely.\n4. Second fry: Heat oil to 190°C. Fry potatoes again in batches for 3–4 minutes until blistered and golden brown.\n5. Immediately transfer to a warm stainless steel bowl. Toss with truffle oil, sea salt, grated parmesan, and minced parsley.\n6. Whisk aioli ingredients until thick and creamy. Serve fries piping hot with garlic aioli.',
    recipeHistory: 'Fries originated in Belgium and northern France in the late 17th century. The pairing with luxury truffles and parmesan gained worldwide fame in New York and Paris bistros during the late 1990s.',
  },
  {
    title: 'The Architecture of Handmade Gnocchi: Pillows of Potato',
    content: 'Making gnocchi that are feather-light rather than dense and gummy comes down to one cardinal rule: handle the dough as little as possible, and use starchy baking potatoes that have had all excess moisture steamed out.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80',
    ingredients: '• 1kg Russet or Yukon Gold Potatoes\n• 150g All-Purpose Flour (plus extra for dusting)\n• 1 Large Egg Yolk\n• 1 tsp Fine Sea Salt\n• Fresh Nutmeg, finely grated\n• Sauce: 100g Salted Butter, Fresh Sage Leaves, Parmigiano-Reggiano',
    instructions: '1. Bake whole potatoes on a bed of rock salt at 200°C for 1 hour until tender inside. Do not boil—baking keeps moisture out!\n2. Slice open while steaming hot and scoop out flesh. Pass immediately through a potato ricer onto a clean board.\n3. Allow steam to escape for 5 minutes. Dust with flour, salt, and grated nutmeg. Add egg yolk.\n4. Gently press dough together with a bench scraper just until it holds. Do not knead!\n5. Roll dough into finger-thick ropes and cut into 3/4-inch pillows. Roll gently over a gnocchi board for classic ridges.\n6. Drop into salted boiling water. Once they float to the surface, cook for 60 seconds and transfer directly into brown sage butter.',
    recipeHistory: 'Gnocchi date back to Roman times, originally made from semolina porridge. Potato gnocchi became popular across northern Italy after potatoes were introduced to Europe from the Americas in the 16th century.',
  },
  {
    title: 'Mexican Birria Tacos with Rich Guajillo Consomé',
    content: 'Few culinary experiences match the sheer satisfaction of biting into a crispy, red-tinted corn tortilla filled with tender braised beef and melted cheese, dipped into a steaming cup of rich chile consomé.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80',
    ingredients: '• 1.5kg Beef Chuck Roast and Beef Shank with bone\n• 5 Dried Guajillo Chiles & 3 Dried Ancho Chiles (stemmed and seeded)\n• 2 Chiles de Árbol for heat\n• 1 White Onion & 6 cloves Garlic\n• 1 Cinnamon Stick, Mexican Oregano, Ground Cumin\n• Corn Tortillas\n• 300g Oaxaca or Mozzarella Cheese\n• Chopped Fresh Cilantro & White Onion for garnish\n• Fresh Lime Wedges',
    instructions: '1. Toast dried chiles in a dry skillet for 1 minute until fragrant. Simmer in water for 15 minutes to soften.\n2. Blend softened chiles with onion, garlic, vinegar, tomatoes, and spices until ultra-smooth. Strain marinade.\n3. Sear seasoned beef in a Dutch oven until browned. Pour chili marinade and beef stock over meat.\n4. Simmer gently covered for 3.5 to 4 hours until beef falls apart effortlessly.\n5. Shred beef and reserve the flavorful fat floating on top of the broth (consomé).\n6. Dip corn tortillas into the red chili fat, place on a hot griddle, top with cheese and shredded beef, fold into tacos, and fry until crispy.\n7. Serve with bowls of steaming consomé topped with chopped onion and cilantro for dipping.',
    recipeHistory: 'Birria originated in the Mexican state of Jalisco in the town of Cocula. Traditionally made with goat meat braised underground in earthenware pots, beef birria de res gained viral fame through street vendors in Tijuana and Los Angeles.',
  },
  {
    title: 'Matcha Crepe Cake: 20 Layers of Velvet Green Tea Pastry',
    content: 'This showstopping dessert alternates twenty whisper-thin green tea crepes with layers of light whipped cream. Chilling the cake overnight allows the crepes to absorb the cream, transforming into a silky, sliceable triumph of French-Japanese fusion.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80',
    ingredients: '• 20g Ceremonial Grade Uji Matcha Powder (plus extra for dusting)\n• 240g Cake Flour\n• 650ml Whole Milk (lukewarm)\n• 4 Large Eggs\n• 60g Unsalted Butter, melted\n• 50g Granulated Sugar\n• Filling: 600ml Heavy Cream, 60g Powdered Sugar, 1 tsp Vanilla extract',
    instructions: '1. Whisk eggs, sugar, and milk together. Sift in cake flour and matcha powder. Whisk until smooth.\n2. Whisk in melted butter. Strain batter through a fine mesh sieve to remove any lumps. Rest batter in fridge for 1 hour.\n3. Heat an 8-inch non-stick skillet over medium-low heat. Pour 3 tablespoons of batter and swirl thinly.\n4. Cook 1 minute until edges lift, flip gently for 20 seconds. Repeat to make 20-22 paper-thin crepes. Cool completely.\n5. Whip heavy cream with powdered sugar and vanilla until stiff peaks form.\n6. Lay first crepe flat, spread a thin, even layer of whipped cream, top with next crepe, and repeat for all layers.\n7. Chill cake in refrigerator for at least 4 hours (ideally overnight). Dust top generously with vibrant matcha before slicing.',
    recipeHistory: 'The multi-layered Mille Crêpe cake was invented in the 1980s by Japanese pastry chef Emy Wada, who wanted to create a pastry that kept crepes fresh and moist.',
  },
];

async function seed() {
  console.log('--- Starting Food Blogs Seeding ---');

  // 1. Ensure an author exists
  let author = await prisma.user.findFirst({
    where: {
      OR: [
        { username: 'chef_marco' },
        { email: 'chef@reciperec.com' }
      ]
    }
  });

  if (!author) {
    const hashedPassword = await bcrypt.hash('RecipeRec2026!', 10);
    author = await prisma.user.create({
      data: {
        username: 'chef_marco',
        email: 'chef@reciperec.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
        role: 'ADMIN',
      }
    });
    console.log(`Created seed author: ${author.username} (${author.id})`);
  } else {
    console.log(`Using existing author: ${author.username} (${author.id})`);
  }

  // 2. Clear existing blogs if wanted, or upsert blogs
  console.log(`Seeding ${foodBlogs.length} rich food blogs...`);
  let createdCount = 0;

  for (const blog of foodBlogs) {
    const existing = await prisma.blog.findFirst({
      where: { title: blog.title }
    });

    if (!existing) {
      await prisma.blog.create({
        data: {
          ...blog,
          authorId: author.id
        }
      });
      createdCount++;
      console.log(`  + Created: "${blog.title.slice(0, 40)}..."`);
    } else {
      console.log(`  = Already exists: "${blog.title.slice(0, 40)}..."`);
    }
  }

  const totalBlogs = await prisma.blog.count();
  console.log(`\nDone! Successfully seeded ${createdCount} new blogs. Total blogs in database: ${totalBlogs}`);
}

seed()
  .catch((err) => {
    console.error('Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
