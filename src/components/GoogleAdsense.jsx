import React, { useEffect } from "react"

const GoogleAdsenseComponent = (props) => {
  const { dataAdSlot } = props

  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={import.meta.env.ADSENSE_CLIENT}
        data-ad-slot={import.meta.env.ADSENSE_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </>
  )
}

export default GoogleAdsenseComponent
