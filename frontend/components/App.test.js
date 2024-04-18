// Write your tests here
import React from "react";
import AppFunctional from "./AppFunctional";
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let coordinates, steps, grid, keypad, emailInput, submitBtn

const setElements = document => {
  coordinates = document.querySelector('#coordinates');
  steps = document.querySelector('#steps');
  grid = document.querySelector('#grid');
  keypad = document.querySelector('#keypad');
  emailInput = document.querySelector('#email');
  submitBtn = document.querySelector('#submit');
}

describe('AppFunctional Component', () => {
  beforeEach(() => {
    render(<AppFunctional />);
    setElements(document);
  });

  test('[1] Top info displays correctly', () => {
    expect(coordinates).toBeVisible();
    expect(coordinates.textContent).toBe('Coordinates (2, 2)');
    expect(steps).toBeVisible();
    expect(steps.textContent).toBe('You moved 0 times');
  })

  test('[2] Grid displays correctly', () => {
    expect(grid).toBeVisible();
  })

  test('[3] Keypad displays correctly', () => {
    expect(keypad).toBeVisible()
  })

  test('[4] Email form displays correctly', () => {
    expect(emailInput).toBeVisible();
    expect(submitBtn).toBeVisible();
  })

  test('[5] Typing an email works correctly', async () => {
    fireEvent.change(emailInput, { target: { value: 'abc@abc.com'}});
    expect(emailInput.value).toBe('abc@abc.com');
  })
})
