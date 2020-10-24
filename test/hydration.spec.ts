/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typings.d.ts"/>
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/svelte";

import Hydration from "../stories/hydration/App.svelte";

describe("Hydration", () => {
    it("should render the first query with the cached data", async () => {
        const { getByText, getAllByText } = render(Hydration);
        // cached data
        expect(getByText("My cached data")).toBeInTheDocument();

        // refetch Query
        fireEvent.click(getByText("refetch Query"));
        await waitFor(() => getAllByText("Query loading..."));
        await waitFor(() => getAllByText("My Data"));
    });
});
