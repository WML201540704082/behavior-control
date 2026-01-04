<script>
export default {
  name: 'TreeIcon',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const icon = context.props.icon;
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }
    return vnodes
  },
}
</script>
