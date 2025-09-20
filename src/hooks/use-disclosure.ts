import * as React from "react"

export function useDisclosure(initial = false) {
  const [open, setOpen] = React.useState(initial)
  const onOpen = React.useCallback(() => setOpen(true), [])
  const onClose = React.useCallback(() => setOpen(false), [])
  const onToggle = React.useCallback(() => setOpen((p) => !p), [])
  return { open, onOpen, onClose, onToggle, setOpen }
}
