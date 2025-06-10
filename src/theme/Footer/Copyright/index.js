/* eslint-disable react/prop-types */

export default function FooterCopyright({ copyright }) {
  return (
    <div
      className="footer__copyright"
      // Developer provided the HTML, so assume it's safe.

      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  );
}
