import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'

describe('HeroSection', () => {
  it('renders properly', () => {
    const heroText = 'Some Hero Text'
    const msg = 'Some message'
    const wrapper = mount(HeroSection, {
      props: { heroText, msg }
    })
    expect(wrapper.text()).toContain(heroText)
    expect(wrapper.text()).toContain(msg)
  })
})
