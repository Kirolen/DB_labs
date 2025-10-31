import { Request, Response } from "express";
import { UnitOfWork } from "../db/unitOfWork";

export class ProductCategoryController {
  static async addProductCategory(req: Request, res: Response) {
    const { name, description, parent_category_id } = req.body;

    const uow = await UnitOfWork.create();
    try {
      await uow.productCategories.addProductCategory(
        name,
        description || null,
        parent_category_id || null
      );
      await uow.commit();
      res.status(201).json({ message: "Product category added successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to add product category",
        details: (err as Error).message,
      });
    }
  }

  static async getProductCategories(req: Request, res: Response) {
    const uow = await UnitOfWork.create();
    try {
      const categories = await uow.productCategories.getProductCategories();
      await uow.commit();
      res.status(200).json({ message: "Product categories retrieved", categories });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get product categories",
        details: (err as Error).message,
      });
    }
  }

  static async getProductCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      const category = await uow.productCategories.getProductCategoryById(categoryId);
      await uow.commit();
      if (!category)
        return res.status(404).json({ error: "Product category not found" });

      res.status(200).json({ message: "Product category retrieved", category });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get product category",
        details: (err as Error).message,
      });
    }
  }

  static async getCategoryHierarchy(req: Request, res: Response) {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      const hierarchy = await uow.productCategories.getCategoryHierarchy(categoryId);
      await uow.commit();
      res.status(200).json({ message: "Category hierarchy retrieved", hierarchy });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get category hierarchy",
        details: (err as Error).message,
      });
    }
  }

  static async updateProductCategory(req: Request, res: Response) {
    const { category_id, name, description, parent_category_id } = req.body;

    const uow = await UnitOfWork.create();
    try {
      await uow.productCategories.updateProductCategory(
        category_id,
        name || null,
        description || null,
        parent_category_id || null
      );
      await uow.commit();
      res.status(200).json({ message: "Product category updated successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to update product category",
        details: (err as Error).message,
      });
    }
  }

  static async softDeleteProductCategory(req: Request, res: Response) {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.productCategories.softDeleteProductCategory(categoryId);
      await uow.commit();
      res.status(200).json({ message: "Product category deleted successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to delete product category",
        details: (err as Error).message,
      });
    }
  }

  static async restoreProductCategory(req: Request, res: Response) {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.productCategories.restoreProductCategory(categoryId);
      await uow.commit();
      res.status(200).json({ message: "Product category restored successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to restore product category",
        details: (err as Error).message,
      });
    }
  }
}
