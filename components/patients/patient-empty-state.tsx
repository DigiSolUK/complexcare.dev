import Image from "next/image"
import { AddPatientDialog } from "./add-patient-dialog"

export function PatientEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Image
          src="/images/empty-states/no-patients.png"
          alt="No patients"
          width={200}
          height={200}
          className="h-40 w-40 opacity-80"
        />
      </div>
      <h3 className="mb-2 text-2xl font-semibold">No patients found</h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        You haven't added any patients yet. Add your first patient to get started.
      </p>
      <AddPatientDialog />
    </div>
  )
}
