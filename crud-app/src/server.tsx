import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import * as fs from "fs";

const filePath: string = "data.json";

function persistData() {
    const mapAsObject = Object.fromEntries(dogs);
    const data = JSON.stringify(mapAsObject);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error("Error writing file asynchronously:", err);
            return;
        }
        console.log("File written successfully (asynchronously with callback).");
    });
}

type Dog = { id: string; name: string; breed: string };

const data: string = fs.readFileSync(filePath, "utf-8");
const parsedData = JSON.parse(data);
const dogs: Map<string, Dog> = new Map(Object.entries(parsedData));

function addDog(name: string, breed: string): Dog {
    const id = crypto.randomUUID();
    const dog = { id, name, breed };
    dogs.set(id, dog);
    return dog;
}

function dogRow(dog: Dog) {
    return (
        <tr class="on-hover">
            <td>{dog.name}</td>
            <td>{dog.breed}</td>
            <td className="buttons">
                <button
                    className="show-on-hover"
                    hx-delete={`/dog/${dog.id}`}
                    hx-confirm="Are you sure?"
                    hx-target="closest tr"
                    hx-swap="delete"
                >
                    ✕
                </button>
            </td>
        </tr>
    );
}

const app = new Hono();

// Serve static files from the public directory
app.use("/*", serveStatic({ root: "./public" }));

app.get("/table-rows", (c: Context) => {
    const sortedDogs = Array.from(dogs.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
    return c.html(<>{sortedDogs.map(dogRow)}</>);
});

app.post("/dog", async (c: Context) => {
    const formData = await c.req.formData();
    const name = (formData.get("name") as string) || "";
    const breed = (formData.get("breed") as string) || "";
    const dog = addDog(name, breed);
    persistData();
    return c.html(dogRow(dog), 201);
});

app.delete("/dog/:id", (c: Context) => {
    const id = c.req.param("id");
    dogs.delete(id);
    persistData();
    return c.body(null);
});

export default app;
