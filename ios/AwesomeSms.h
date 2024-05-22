
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAwesomeSmsSpec.h"

@interface AwesomeSms : NSObject <NativeAwesomeSmsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AwesomeSms : NSObject <RCTBridgeModule>
#endif

@end
