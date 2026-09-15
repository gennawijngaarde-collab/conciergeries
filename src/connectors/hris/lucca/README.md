# Lucca HRIS Connector

**Status:** Placeholder - Not yet implemented

This connector will integrate with Lucca HRIS system.

## Implementation Checklist

- [ ] Implement `LuccaConnector` class extending `BaseHRISConnector`
- [ ] Implement Lucca API authentication
- [ ] Implement `syncEmployees()` method
- [ ] Implement `handleWebhook()` method
- [ ] Implement data mapping from Lucca format to Universal HR Model
- [ ] Implement webhook signature validation
- [ ] Add health check implementation
- [ ] Add comprehensive error handling
- [ ] Add unit tests
- [ ] Add integration tests

## Configuration

```typescript
{
  apiUrl: 'https://[tenant].ilucca.net/api/v3',
  apiKey: 'encrypted_api_key',
  webhookSecret: 'encrypted_webhook_secret'
}
```

## Supported Events

- Employee created
- Employee terminated
- Employee job changed
- Employee department changed
- Employee manager changed

## API Documentation

https://developers.lucca.fr/
