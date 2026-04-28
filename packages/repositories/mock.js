"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.MockUserRepository = exports.MockInventoryRepository = exports.MockProductRepository = void 0;
const database_1 = require("@repo/database");
/**
 * Mock Product Repository
 */
class MockProductRepository {
    products = [];
    async create(data) {
        const newProduct = {
            ...data,
            id: crypto.randomUUID(), // Trong thực tế Zod v4 z.uuidv7() sẽ dùng ở đây
        };
        this.products.push(newProduct);
        return newProduct;
    }
    async findById(id) {
        return this.products.find(p => p.id === id) || null;
    }
    async findAll() {
        return this.products;
    }
    async update(id, data) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1)
            throw new Error('Product not found');
        this.products[index] = { ...this.products[index], ...data };
        return this.products[index];
    }
    async delete(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        return this.products.length < initialLength;
    }
    async findByBarcode(barcode) {
        return this.products.find(p => p.barcode === barcode) || null;
    }
    async findByOwner(ownerId) {
        return this.products.filter(p => p.ownerId === ownerId);
    }
    async findGlobal() {
        return this.products.filter(p => p.isGlobal);
    }
}
exports.MockProductRepository = MockProductRepository;
/**
 * Mock Inventory Repository
 */
class MockInventoryRepository {
    inventory = database_1.mockDatabase.inventory;
    async create(data) {
        const newItem = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.inventory.push(newItem);
        return newItem;
    }
    async findById(id) {
        return this.inventory.find(item => item.id === id) || null;
    }
    async findAll() {
        return this.inventory;
    }
    async update(id, data) {
        const index = this.inventory.findIndex(item => item.id === id);
        if (index === -1)
            throw new Error('Inventory item not found');
        this.inventory[index] = { ...this.inventory[index], ...data, updatedAt: new Date() };
        return this.inventory[index];
    }
    async delete(id) {
        const initialLength = this.inventory.length;
        this.inventory = this.inventory.filter(item => item.id !== id);
        return this.inventory.length < initialLength;
    }
    async findAllByUserId(userId) {
        return this.inventory.filter(item => item.userId === userId);
    }
    async findByProduct(productId) {
        return this.inventory.filter(item => item.productId === productId);
    }
}
exports.MockInventoryRepository = MockInventoryRepository;
/**
 * Mock User Repository
 */
class MockUserRepository {
    users = database_1.mockDatabase.users;
    async create(data) {
        const newUser = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }
    async findById(id) {
        return this.users.find(u => u.id === id) || null;
    }
    async findAll() {
        return this.users;
    }
    async update(id, data) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1)
            throw new Error('User not found');
        this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() };
        return this.users[index];
    }
    async delete(id) {
        const initialLength = this.users.length;
        this.users = this.users.filter(u => u.id !== id);
        return this.users.length < initialLength;
    }
    async findByEmail(email) {
        return this.users.find(u => u.email === email) || null;
    }
}
exports.MockUserRepository = MockUserRepository;
exports.userRepository = new MockUserRepository();
