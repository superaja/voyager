/**
 * @jest-environment jsdom
 */
import {mount} from 'enzyme';
import * as React from 'react';


import {Provider} from 'react-redux';
import {configureStore} from '../store';
import {App} from './app';

const DEFAULT_TIMEOUT_LENGTH = 300;

describe('Voyager', () => {
  describe('instantiation via component', () => {
    it('renders voyager', done => {
      const config = {};
      const data: any = undefined;
      const store = configureStore();

      setTimeout(() => {
        try {
          const wrapper = mount(
            <Provider store={store}>
              <App
                  config={config}
                  data={data}
                  dispatch={store.dispatch}
              />
            </Provider>,
          );

          const dataPaneHeader = wrapper.find('.data-pane__data-pane h2');
          expect(dataPaneHeader.exists());
          expect(dataPaneHeader.text()).toContain('Data');
        } catch (err) {
          done.fail(err);
        }
        done();
      }, DEFAULT_TIMEOUT_LENGTH);
    });

    it('renders voyager with custom data', done => {
      const config = {};
      const data: any = {
        "values": [
          {"fieldA": "A", "fieldB": 28}, {"fieldA": "B", "fieldB": 55}, {"fieldA": "C", "fieldB": 43},
          {"fieldA": "D", "fieldB": 91}, {"fieldA": "E", "fieldB": 81}, {"fieldA": "F", "fieldB": 53},
          {"fieldA": "G", "fieldB": 19}, {"fieldA": "H", "fieldB": 87}, {"fieldA": "I", "fieldB": 52}
        ]
      };
      const store = configureStore();

      setTimeout(() => {
        try {
          const wrapper = mount(
            <Provider store={store}>
              <App
                  config={config}
                  data={data}
                  dispatch={store.dispatch}
              />
            </Provider>,
          );

          setTimeout(() => {
            try {
              const fieldList = wrapper.find('.field-list__field-list-item');
              const fields = fieldList.children().map(d => d.text());

              expect(fields).toContain(' fieldA');
              expect(fields).toContain(' fieldB');
              done();
            } catch (err) {
              done.fail(err);
            }

          }, DEFAULT_TIMEOUT_LENGTH);
        } catch (err) {
          done.fail(err);
        }
      }, DEFAULT_TIMEOUT_LENGTH);
    });

  });

  describe('vega-lite spec', () => {
    it('accepts valid spec', done => {
      const config = {};
      const data: any = undefined;
      const store = configureStore();

      const values = [
        {date: "24-Apr-07", close: "93.24"},
        {date: "25-Apr-07", close: "95.35"},
        {date: "26-Apr-07", close: "98.84"},
        {date: "27-Apr-07", close: "99.92"},
      ];

      const spec: Object = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": {
          values
        },
        "mark": "bar",
        "encoding": {
          "x": {
            "bin": {"maxbins": 10},
            "field": "close",
            "type": "quantitative"
          },
          "y": {
            "aggregate": "count",
            "type": "quantitative"
          }
        }
      };

      setTimeout(() => {
        try {
          const wrapper = mount(
            <Provider store={store}>
              <App
                config={config}
                data={data}
                dispatch={store.dispatch}
                spec={spec}
              />
            </Provider>,
          );

          setTimeout(() => {
            try {
              const fieldList = wrapper.find('.encoding-shelf__encoding-shelf');
              const fields = fieldList.map(d => d.text());

              expect(fields).toContain('x close');
              done();
            } catch (err) {
              done.fail(err);
            }
          }, DEFAULT_TIMEOUT_LENGTH);

        } catch (err) {
          done.fail(err);
        }
      }, DEFAULT_TIMEOUT_LENGTH);
    });

    it('error on invalid spec', done => {
      const config = {};
      const data: any = undefined;
      const store = configureStore();

      const spec: Object = {
        "FAIL$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "FAILdata": {"url": "node_modules/vega-datasets/data/movies.json"},
        "FAILmark": "bar",
        "encoding": {
        }
      };

      // This should throw an exception;
      setTimeout(() => {
        try {
          mount(
            <Provider store={store}>
              <App
                config={config}
                data={data}
                dispatch={store.dispatch}
                spec={spec}
              />
            </Provider>,
          );

          done.fail('No exception thrown with invalid spec');

        } catch (err) {
          expect(true);
          done();
        }

      }, DEFAULT_TIMEOUT_LENGTH);
    });

  });

});
