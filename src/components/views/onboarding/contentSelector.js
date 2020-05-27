import { OnboardingContent } from 'common/constants'

export const select = options => {
  const contentKey = Object.keys(OnboardingContent).find(key =>
    OnboardingContent[key].shouldDisplay(options)
  )

  return OnboardingContent[contentKey]
}
