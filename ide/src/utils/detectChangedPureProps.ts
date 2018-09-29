export function detectChangedPureProps<Props>(
  this: { props: Props },
  prevProps: Props
) {
  console.warn(diff(prevProps, this.props)); // tslint:disable-line
}

function diff<Props>(prevProps: Props, props: Props): string[] {
  const different = [];
  const keys = Array.from(
    new Set([...Object.keys(props), ...Object.keys(prevProps)])
  );
  for (const key of keys) {
    if (props[key] !== prevProps[key]) {
      different.push(key);
    }
  }
  return different;
}
