import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language.context"

function Spinner({ className, ...props }) {
  const { t } = useLanguage()

  return (
    <LoaderIcon
      role="status"
      aria-label={t("Loading")}
      className={cn("size-4 animate-spin ", className )}
      {...props}
    />
  )
}

export { Spinner }