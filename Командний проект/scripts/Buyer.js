class Buyer {
  static idCounter = 0;

  static CHARACTER_TYPES = {
    impulsive: "імпульсивний",
    balanced: "збалансований",
    cautious: "обережний",
    troublemaker: "шкідник",
  };

  static PROBABILITY_MAP = {
    імпульсивний: {
      new: 0.9,
      no_discount: 0.8,
      discount: 0.95,
      big_discount: 0.99,
    },
    збалансований: {
      new: 0.4,
      no_discount: 0.5,
      discount: 0.6,
      big_discount: 0.7,
    },
    обережний: {
      new: 0.05,
      no_discount: 0.2,
      discount: 0.1,
      big_discount: 0.15,
    },
    шкідник: {
      new: 0,
      no_discount: 0,
      discount: 0,
      big_discount: 0,
    },
  };

  constructor() {
    this.id = Buyer.idCounter++;
    this.character = Buyer.getRandomCharacter();
    this.viewLimit = Buyer.getRandomViewLimit();
    this.purchaseProbabilityMap = Buyer.PROBABILITY_MAP[this.character];
    this.purchasedItems = [];
    this.purchaseStats = {
      totalViewed: this.viewLimit,
      totalBought: 0,
      categoryTypes: {
        new: 0,
        no_discount: 0,
        discount: 0,
        big_discount: 0,
      },
    };
    this.colorClass = "buyer-medium";
  }

  static getRandomCharacter() {
    const values = [
      Buyer.CHARACTER_TYPES.impulsive,
      Buyer.CHARACTER_TYPES.impulsive,
      Buyer.CHARACTER_TYPES.balanced,
      Buyer.CHARACTER_TYPES.cautious,
      Buyer.CHARACTER_TYPES.troublemaker,
    ];
    return values[Math.floor(Math.random() * values.length)];
  }

  static getRandomViewLimit(min = 3, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  decideToBuy(category_type) {
    const probability = this.purchaseProbabilityMap[category_type] || 0;
    return Math.random() < probability;
  }

  buy(item) {
    this.purchasedItems.push(item);
    this.purchaseStats.totalBought++;
    const type = item.category_type || "no_discount";
    if (this.purchaseStats.categoryTypes.hasOwnProperty(type)) {
      this.purchaseStats.categoryTypes[type]++;
    }
  }

  getScore() {
    const count = this.purchasedItems.length;
    if (this.character === Buyer.CHARACTER_TYPES.troublemaker) return -5;
    if (count >= 5) return 15;
    if (count >= 3) return 4;
    if (count >= 1) return 1;
    return -3;
  }

  assignColorClass() {
    const score = this.getScore();
    if (this.character === Buyer.CHARACTER_TYPES.troublemaker) {
      this.colorClass = "buyer-trouble";
      return;
    }
    if (score >= 8) this.colorClass = "buyer-high";
    else if (score <= -3) this.colorClass = "buyer-low";
    else this.colorClass = "buyer-medium";
  }
}

const BuyerFactory = {
  createBuyer() {
    const buyer = new Buyer();
    return buyer;
  },
};
