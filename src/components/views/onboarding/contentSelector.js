import { OnboardingContent } from 'common/constants'

export const select = (currentPage, viewedPopups, enabledOnboarding) => {
  const contentKey = Object.keys(OnboardingContent).find(key =>
    OnboardingContent[key].shouldDisplay(
      enabledOnboarding,
      currentPage,
      viewedPopups
    )
  )

  return OnboardingContent[contentKey]
}
