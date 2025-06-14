import clsx from 'clsx';
import BlogSidebar from '@theme/BlogSidebar';
import Layout from '@theme/Layout';

export default function BlogLayout(props) {
  // TODO: Add prop-types and/or convert to TS!
  // eslint-disable-next-line react/prop-types
  const { sidebar, toc, children, ...layoutProps } = props;
  // eslint-disable-next-line react/prop-types
  const hasSidebar = sidebar && sidebar.items.length > 0;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          <main
            className={clsx('col', {
              'col--7': hasSidebar && toc,
              'col--9': hasSidebar && !toc,
              'col--9 col--offset-1': !hasSidebar,
            })}
            itemScope
            itemType="http://schema.org/Blog"
          >
            {children}
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
