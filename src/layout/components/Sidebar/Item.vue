<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // h === createElement
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    // if (icon) {
    //   vnodes.push(h("svg-icon", {
    //     "attrs": {
    //       "icon-class": icon
    //     }
    //   }));
    // }

    // if (title) {
    //   vnodes.push(h("span", {
    //     "slot": 'title'
    //   }, [title]));
    // }
    return vnodes
  }
}
</script>
