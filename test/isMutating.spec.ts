/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typings.d.ts"/>
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor, screen } from "@testing-library/svelte";

import IsMutating from "../stories/isMutating/App.svelte";

describe("IsMutating", () => {
  it("should render the fetching history", async () => {
    render(IsMutating);
    expect(screen.getByText("[0]")).toBeInTheDocument();
    // mutate
    fireEvent.click(screen.getByText("mutate"));
    await waitFor(() => expect(screen.getByText("[0,1,0]")).toBeInTheDocument());
    // mutate all Mutations
    fireEvent.click(screen.getByText("Mutate All"));
    await waitFor(() => expect(screen.getByText("[0,1,0,2,1,0]")).toBeInTheDocument());
  });
});
