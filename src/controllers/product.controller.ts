import { Request, Response } from "express";
import { UnitOfWork } from "../db/unitOfWork";

export class ProductController {
  static async addProduct(req: Request, res: Response) {
    const {
      name,
      description,
      sku,
      unit_price,
      stock_quantity,
      reorder_level,
      supplier_id,
      updated_by,
      categories,
    } = req.body;
    
    const uow = await UnitOfWork.create();
    try {
      await uow.products.addProduct(
        name,
        description || null,
        sku || null,
        unit_price || 0,
        stock_quantity || 0,
        reorder_level || 10,
        supplier_id || null,
        updated_by || null,
        categories || []
      );
      await uow.commit();
      res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to add product",
        details: (err as Error).message,
      });
    }
  }

  static async getProducts(req: Request, res: Response) {
    const uow = await UnitOfWork.create();
    try {
      const products = await uow.products.getProducts();
      await uow.commit();
      res.status(200).json({ message: "Products retrieved", products });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get products",
        details: (err as Error).message,
      });
    }
  }

  static async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      const product = await uow.products.getProductById(productId);
      await uow.commit();
      if (!product) return res.status(404).json({ error: "Product not found" });

      res.status(200).json({ message: "Product retrieved", product });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get product",
        details: (err as Error).message,
      });
    }
  }

  static async getProductsByCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
    const category_id = parseInt(categoryId, 10);

    if (isNaN(category_id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      const products = await uow.products.getProductsByCategory(category_id);
      await uow.commit();
      res.status(200).json({ message: "Products retrieved", products });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get products",
        details: (err as Error).message,
      });
    }
  }

  static async getProductsNeedingReorder(req: Request, res: Response) {
    const uow = await UnitOfWork.create();
    try {
      const products = await uow.products.getProductsNeedingReorder();
      await uow.commit();
      res.status(200).json({ message: "Products retrieved", products });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get products",
        details: (err as Error).message,
      });
    }
  }

  static async searchProducts(req: Request, res: Response) {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Search term is required" });
    }

    const uow = await UnitOfWork.create();
    try {
      const products = await uow.products.searchProducts(q);
      await uow.commit();
      res.status(200).json({ message: "Products retrieved", products });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to search products",
        details: (err as Error).message,
      });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    const {
      product_id,
      name,
      description,
      sku,
      unit_price,
      stock_quantity,
      reorder_level,
      supplier_id,
      updated_by,
      add_categories,
      remove_categories,
    } = req.body;

    const uow = await UnitOfWork.create();
    try {
      await uow.products.updateProduct(
        product_id,
        name || null,
        description || null,
        sku || null,
        unit_price || null,
        stock_quantity || null,
        reorder_level || null,
        supplier_id || null,
        updated_by || null,
        add_categories || [],
        remove_categories || []
      );
      await uow.commit();
      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to update product",
        details: (err as Error).message,
      });
    }
  }

  static async updateProductStock(req: Request, res: Response) {
    const { id } = req.params;
    const { quantity_change } = req.body;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    if (typeof quantity_change !== "number") {
      return res.status(400).json({ error: "Quantity change must be a number" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.products.updateProductStock(productId, quantity_change);
      await uow.commit();
      res.status(200).json({ message: "Product stock updated successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to update product stock",
        details: (err as Error).message,
      });
    }
  }

  static async softDeleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.products.softDeleteProduct(productId);
      await uow.commit();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to delete product",
        details: (err as Error).message,
      });
    }
  }

  static async restoreProduct(req: Request, res: Response) {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.products.restoreProduct(productId);
      await uow.commit();
      res.status(200).json({ message: "Product restored successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to restore product",
        details: (err as Error).message,
      });
    }
  }
}
