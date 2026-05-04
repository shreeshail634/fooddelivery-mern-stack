import Food from '../models/Food.js';

export const getFoodByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({ restaurant: req.params.restaurantId });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFood = async (req, res) => {
  try {
    const { name, description, price, category, restaurant } = req.body;
    let image = '';
    
    if (req.file) {
      image = `/uploads/food/${req.file.filename}`;
    }

    const food = new Food({
      name,
      description,
      price,
      image,
      category,
      restaurant
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
