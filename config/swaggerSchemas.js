// Inline Swagger schemas for Vercel compatibility
const swaggerSchemas = {
  User: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      money: { type: "number" },
      admin: { type: "boolean" },
      isEmailVerified: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  Book: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      author: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" }
        }
      },
      category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" }
        }
      },
      type: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" }
        }
      },
      description: { type: "string" },
      publication_date: { type: "string", format: "date" },
      price: { type: "number" },
      borrow_price: { type: "number" },
      cover_image_url: { type: "string" },
      pdf_url: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  Author: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  Category: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  Type: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  Subscription: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      duration_days: { type: "integer" },
      books_quota: { type: "integer" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  },
  ActiveSubscription: {
    type: "object",
    properties: {
      _id: { type: "string" },
      user: { type: "string" },
      subscription: { "$ref": "#/components/schemas/Subscription" },
      start_date: { type: "string", format: "date-time" },
      end_date: { type: "string", format: "date-time" },
      books_remaining: { type: "integer" },
      status: { type: "string", enum: ["active", "expired"] },
      createdAt: { type: "string", format: "date-time" }
    }
  },
  Transaction: {
    type: "object",
    properties: {
      _id: { type: "string" },
      user: { type: "string" },
      type: { type: "string", enum: ["purchase", "borrow", "subscription"] },
      amount: { type: "number" },
      item: { type: "string" },
      description: { type: "string" },
      createdAt: { type: "string", format: "date-time" }
    }
  },
  Offer: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      discount_percentage: { type: "number" },
      start_date: { type: "string", format: "date-time" },
      end_date: { type: "string", format: "date-time" },
      users: { type: "array", items: { type: "string" } },
      books: { type: "array", items: { type: "string" } },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    }
  }
};

module.exports = swaggerSchemas;
