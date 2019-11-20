import { OnboardingContent } from 'common/constants'

export const select = (
  currentPage,
  viewedPopups,
  enabledOnboarding,
  rootchainAssets
) => {
  const contentKey = Object.keys(OnboardingContent).find(key =>
    OnboardingContent[key].shouldDisplay(
      enabledOnboarding,
      currentPage,
      viewedPopups,
      rootchainAssets
    )
  )

  return OnboardingContent[contentKey]
}
