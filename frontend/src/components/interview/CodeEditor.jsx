import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const Editor = lazy(() =>
  import('@monaco-editor/react').then((m) => ({ default: m.Editor }))
  .catch(err => console.error(err))