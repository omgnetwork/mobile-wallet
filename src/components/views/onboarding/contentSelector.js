import { OnboardingContent } from 'common/constants'

export const select = (
  currentPage,
  viewedPopups,
  enabledOnboarding,
  options
) => {
  const contentKey = Object.keys(OnboardingContent).find(key =>
    OnboardingContent[key].shouldDisplay(
      enabledOnboarding,
      currentPage,
      viewedPopups,
      options
    )
  )

  return OnboardingContent[contentKey]
}
