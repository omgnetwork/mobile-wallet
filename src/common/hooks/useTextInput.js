import { useState, useCallback } from 'react'

const useTextInput = actionId => {
  const [text, setText] = useState(null)

  const textCallback = useCallback(
    receiveText => {
      if (actionId != null) {
        setText(receiveText)
        return actionId
      }
    },
    [actionId]
  )

  return [text, textCallback]
}

export default useTextInput
