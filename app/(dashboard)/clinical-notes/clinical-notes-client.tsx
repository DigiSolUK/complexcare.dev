"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { ClinicalNoteCategory, ClinicalNoteTemplate, ClinicalNote } from "@/lib/services/clinical-notes-service"

export default function ClinicalNotesClient() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([]);
  const [templates, setTemplates] = useState<ClinicalNoteTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [notesRes, categoriesRes, templatesRes] = await Promise.all([
          fetch("/api/clinical-notes"),
          fetch("/api/clinical-notes/categories"),
          fetch("/api/clinical-notes/templates"),
        ]);

        if (!notesRes.ok || !categoriesRes.ok || !templatesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [notesData, categoriesData, templatesData] = await Promise.all([
          notesRes.json(),
          categoriesRes.json(),
          templatesRes.json(),
        ]);

        setNotes(notesData);
        setCategories(categoriesData);
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load clinical notes data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreateNote = async (note: Omit<ClinicalNote, "id" | "createdBy" | "createdAt" | "updatedAt" | "categoryName">) => {
    try {
      const response = await fetch("/api/clinical-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const newNote = await response.json();
      setNotes((prev) => [newNote, ...prev]);
      setIsCreateNoteOpen(false);
      toast({
        title: "Success",
        description: "Clinical note created successfully",
      });
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to create clinical note",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async (category: Omit<ClinicalNoteCategory, "id">) => {
    try {
      const response = await fetch("/api/clinical-notes/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      setIsCreateCategoryOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleCreateTemplate = async (template: Omit<ClinicalNoteTemplate, "id" | "categoryName">) => {
    try {
      const response = await fetch("/api/clinical-notes/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error("Failed to create template");
      }

      const newTemplate = await response.json();
      setTemplates((prev) => [...prev, newTemplate]);
      setIsCreateTemplateOpen(false);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/clinical-notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      toast({
        title: "Success",
        description: "Clinical note deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete clinical note",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = async (noteId: string, updatedData: Partial<ClinicalNote>) => {
