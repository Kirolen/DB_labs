import { Request, Response } from "express";
import { UnitOfWork } from "../db/unitOfWork";

export class SupplierController {
  static async addSupplier(req: Request, res: Response) {
    const {
      name,
      contact_name,
      contact_email,
      phone,
      address,
      country,
      rating,
      updated_by,
      contacts,
    } = req.body;

    const uow = await UnitOfWork.create();
    try {
      await uow.suppliers.addSupplier(
        name,
        contact_name || null,
        contact_email || null,
        phone || null,
        address || null,
        country || null,
        rating || 0,
        updated_by || null,
        contacts || []
      );
      await uow.commit();
      res.status(201).json({ message: "Supplier added successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to add supplier",
        details: (err as Error).message,
      });
    }
  }

  static async getSuppliers(req: Request, res: Response) {
    const uow = await UnitOfWork.create();
    try {
      const suppliers = await uow.suppliers.getSuppliers();
      await uow.commit();
      res.status(200).json({ message: "Suppliers retrieved", suppliers });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get suppliers",
        details: (err as Error).message,
      });
    }
  }

  static async getSupplierById(req: Request, res: Response) {
    const { id } = req.params;
    const supplierId = parseInt(id, 10);

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      const supplier = await uow.suppliers.getSupplierById(supplierId);
      await uow.commit();
      if (!supplier)
        return res.status(404).json({ error: "Supplier not found" });

      res.status(200).json({ message: "Supplier retrieved", supplier });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get supplier",
        details: (err as Error).message,
      });
    }
  }

  static async updateSupplier(req: Request, res: Response) {
    const {
      supplier_id,
      name,
      contact_name,
      contact_email,
      phone,
      address,
      country,
      rating,
      updated_by,
      update_contacts,
      new_contacts,
      delete_contacts,
    } = req.body;

    const uow = await UnitOfWork.create();
    try {
      await uow.suppliers.updateSupplier(
        supplier_id,
        name || null,
        contact_name || null,
        contact_email || null,
        phone || null,
        address || null,
        country || null,
        rating || null,
        updated_by || null,
        update_contacts || [],
        new_contacts || [],
        delete_contacts || []
      );
      await uow.commit();
      res.status(200).json({ message: "Supplier updated successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to update supplier",
        details: (err as Error).message,
      });
    }
  }

  static async softDeleteSupplier(req: Request, res: Response) {
    const { id } = req.params;
    const supplierId = parseInt(id, 10);

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.suppliers.softDeleteSupplier(supplierId);
      await uow.commit();
      res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to delete supplier",
        details: (err as Error).message,
      });
    }
  }

    static async restoreSupplier(req: Request, res: Response) {
    const { id } = req.params;
    const supplierId = parseInt(id, 10);

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    const uow = await UnitOfWork.create();
    try {
      await uow.suppliers.restoreSupplier(supplierId);
      await uow.commit();
      res.status(200).json({ message: "Supplier restored successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to restore supplier",
        details: (err as Error).message,
      });
    }
  }
}
