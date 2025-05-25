"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface PatientMedicalHistoryProps {
  patientId: string
}

export function PatientMedicalHistory({ patientId }: PatientMedicalHistoryProps) {
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [diagnosisDate, setDiagnosisDate] = useState<Date | undefined>();
  const [resolutionDate, setResolutionDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}/medical-history`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical history');
      }
      const data = await response.json();
      setMedicalHistory(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({
      condition_name: '',
      status: '',
      severity: '',
      diagnosed_by: '',
      notes: '',
      treatment_summary: ''
    });
    setDiagnosisDate(undefined);
    setResolutionDate(undefined);
    setShowAddDialog(true);
  };

  const handleEditClick = (record: any) => {
    setSelectedRecord(record);
    setFormData({
      id: record.id,
      condition_name: record.condition_name,
      status: record.status,
      severity: record.severity || '',
      diagnosed_by: record.diagnosed_by || '',
      notes: record.notes || '',
      treatment_summary: record.treatment_summary || ''
    });
    setDiagnosisDate(record.diagnosis_date ? new Date(record.diagnosis_date) : undefined);
    setResolutionDate(record.resolution_date ? new Date(record.resolution_date) : undefined);
    setShowEditDialog(true);
  };

  const handleAddSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        diagnosis_date: diagnosisDate ? format(diagnosisDate, 'yyyy-MM-dd') : null,
        resolution_date: res
