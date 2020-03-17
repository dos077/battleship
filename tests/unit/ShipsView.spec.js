import ShipsView from '@/components/ShipsView.vue'
import { mount } from '@vue/test-utils'

const shipStock = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Destroyer', size: 3 },
];

const float = [
  { name: 'Carrier', size: 5 },
];

const sunk = [
  { name: 'Battleship', size: 4 },
  { name: 'Destroyer', size: 3 },
]

describe('Ship view in building phase', () => {
  const wrapper = mount(ShipsView, {
    propsData: {
      shipStock: shipStock,
      float: [],
      sunk: [],
    }
  })

  test('renders ship selections', () => {
    expect(wrapper.findAll('.ship').length).toBe(shipStock.length);
    const target = wrapper.find('#s-2');
    target.trigger('click');
    expect(wrapper.emitted().select).toBeTruthy();
    const payload = wrapper.emitted().select[0][0];
    expect(payload).toBe(2);
  });
});

describe('ship view in attacking phase', () => {
  const wrapper = mount(ShipsView, {
    propsData: {
      shipStock: [],
      float: float,
      sunk: sunk,
    }
  });

  test('renders all ships', () => {
    expect(wrapper.findAll('.ship').length).toBe(3);
  });
});