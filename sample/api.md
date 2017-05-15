---
title: API Documentation
---
# API

## `ProjectGenerator`

```ts
import { ProjectGenerator } from 'demo-driven'

// create generator using default or config in `demo-driven.json`
const generator = new ProjectGenerator()

// generate from "demo" under current directory
await generator.generate()
```
